import digitalio
import board
import microcontroller
from microcontroller import watchdog
from watchdog import WatchDogMode
import time
import analogio
import collections
import wifi, ssl, socketpool, adafruit_requests
import busio
import sdcardio
import storage
import json
import countio

WATCHDOG_ENABLED = True

# Session variables file
LOCALS_FILE = "/sdcard/locals.json"
ALT_LOCALS_FILE = "/sdcard/locals.json.bak"

# Log locations
SD_ERROR_LOG = "/sdcard/error_log.csv"
SD_SENSOR_LOG = "/sdcard/sensor_log"
SD_SENSOR_LOG_TEMP = "/sdcard/sensor_log_to_upload"

# WIFI credentials
SSID = "SSID"
WPAKEY = "WPAKEY"

# URLs and tokens
REGION = "Europe/Vienna"
TIME_SERVER_URL = f"https://worldtimeapi.org/api/timezone/{REGION}"

ORGANIZATION_NAME = "<ORG_NAME>"
BUCKET_NAME = "<BUCKET>"
INFLUXDB_SERVER_URL = (
    "https://eu-central-1-1.aws.cloud2.influxdata.com/api/v2/write"
    f"?org={ORGANIZATION_NAME}&bucket={BUCKET_NAME}&precision=s"
)
INFLUXDB_API_TOKEN = "<TOKEN>"
INFLUXDB_MEASUREMENT = "<MEASUREMENT>"

## Time
# Server unix time
server_time = 0
# Last time it was fetched acording to time.monotonic()
last_fetched_server_time = 0
# For countering monotonic changing on reset
old_monotonic = 0

## On board LED
led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT

## Water pump
# Control pin
pump = digitalio.DigitalInOut(board.GP1)
pump.direction = digitalio.Direction.OUTPUT
# States 0 - stale, 1 - active, 2, draining
pumping_state = 2
# Timer
pump_timer = time.monotonic()

## Water tank alert (0 disabled, 1 enabled)
water_tank_alert = bool(False)
tank_sensor = countio.Counter(board.GP7, edge=countio.Edge.FALL, pull=digitalio.Pull.UP)
tank_reset = countio.Counter(board.GP17, edge=countio.Edge.FALL, pull=digitalio.Pull.UP)
tank_led = digitalio.DigitalInOut(board.GP16)
tank_led.direction = digitalio.Direction.OUTPUT
tank_led.value = True


## On board thermometer
cpu_temp = microcontroller.cpu.temperature

## Soil sensing
# Sensors nalog input
soil_raw_1 = analogio.AnalogIn(board.GP26)
soil_raw_2 = analogio.AnalogIn(board.GP27)
# Sensors filtering buffers
soil_buffer_1 = collections.deque((), 10)
soil_buffer_2 = collections.deque((), 10)
# Filtered sensor values
soil_moist_1 = 0
soil_moist_2 = 0
# Soil state 0 - drought, 1 - wet
soil_state = 0
# Soil timer
soil_timer = time.monotonic()

# Watchdog tracking
watchdog_location = str()

## SD card
spi = busio.SPI(clock=board.GP2, MOSI=board.GP3, MISO=board.GP4)
sdcard = sdcardio.SDCard(spi, board.GP5)
vfs = storage.VfsFat(sdcard)
storage.mount(vfs, "/sdcard")

## Section logging on json
section_variables = dict()


def read_locals():
    local_variables = {
        "server_time": server_time,
        "last_fetched_server_time": last_fetched_server_time,
        "pumping_state": pumping_state,
        "pump_timer": pump_timer,
        "soil_buffer_1": deq_to_list(soil_buffer_1),
        "soil_buffer_2": deq_to_list(soil_buffer_2),
        "soil_moist_1": soil_moist_1,
        "soil_moist_2": soil_moist_2,
        "soil_state": soil_state,
        "water_tank_alert": water_tank_alert,
        "watchdog_location": watchdog_location,
        "old_monotonic": time.monotonic(),
    }
    return local_variables


def save_locals():
    local_variables = read_locals()
    with open(LOCALS_FILE, "w") as l:
        l.write(json.dumps(local_variables))


def load_locals():
    try:
        with open(LOCALS_FILE, "r") as l:
            local_variables = json.loads(l.read())
    except:
        with open("locals.json.bak", "r") as l:
            local_variables = json.loads(l.read())
    global server_time
    global last_fetched_server_time
    global pumping_state
    global pump_timer
    global soil_buffer_1
    global soil_buffer_2
    global soil_moist_1
    global soil_moist_2
    global soil_state
    global water_tank_alert
    global old_monotonic
    server_time = local_variables["server_time"]
    last_fetched_server_time = local_variables["last_fetched_server_time"]
    pumping_state = local_variables["pumping_state"]
    pump_timer = local_variables["pump_timer"]
    soil_buffer_1 = list_to_deq(local_variables["soil_buffer_1"])
    soil_buffer_2 = list_to_deq(local_variables["soil_buffer_2"])
    soil_moist_1 = local_variables["soil_moist_1"]
    soil_moist_2 = local_variables["soil_moist_2"]
    soil_state = local_variables["soil_state"]
    water_tank_alert = local_variables["water_tank_alert"]
    old_monotonic = local_variables["old_monotonic"]



# Setup watchdog timer for resetting the board if problems occure
def start_watchdog():
    microcontroller.watchdog.timeout = 6
    microcontroller.watchdog.mode = WatchDogMode.RESET


# Connect to wifi and start session
def wifi_connect(ssid, wpakey) -> adafruit_requests.Session:
    wifi.radio.connect(ssid, wpakey)
    print("Connected to wifi!")
    pool = socketpool.SocketPool(wifi.radio)
    session = adafruit_requests.Session(pool, ssl.create_default_context())
    print("Session started!")
    return session


# Mapping function for converting ranges
def map_range(value, in_min, in_max, out_min, out_max):
    mapped = (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
    mapped_capped = mapped if mapped > 0 else 0
    mapped_capped = mapped_capped if mapped_capped < 100 else 100
    return mapped_capped


def deq_to_list(deq):
    deq_list = []
    while True:
        try:
            deq_list.append(deq.popleft())
        except IndexError:
            break
    for v in deq_list:
        deq.append(v)
    return deq_list


def list_to_deq(li):
    de = collections.deque((), 10)
    for v in li:
        de.append(v)
    return de


# Soil sensor normalized and filtered from buffers
def get_moist(sensor_number):
    buffer = soil_buffer_1 if sensor_number == 1 else soil_buffer_2
    list_buffer = deq_to_list(buffer)
    total = sum(list_buffer)
    count = len(list_buffer)
    return total / count


# Reading all available sensors
def read_sensors():
    # Moisture
    soil_norm_1 = map_range(soil_raw_1.value, 20000, 60000, 100, 0)
    soil_buffer_1.append(soil_norm_1)
    soil_norm_2 = map_range(soil_raw_2.value, 20000, 60000, 100, 0)
    soil_buffer_2.append(soil_norm_2)
    global soil_moist_1
    global soil_moist_2
    soil_moist_1 = get_moist(1)
    soil_moist_2 = get_moist(2)
    # Temperature
    global cpu_temp
    cpu_temp = microcontroller.cpu.temperature
    # Water tank level
    global water_tank_alert
    if tank_sensor.count > 0:
        water_tank_alert = True
        tank_sensor.reset()

    # Logging
    time_now = unix_time_now()
    log_sensor("SOIL1", {"moisture": soil_moist_1}, time_now)
    log_sensor("SOIL2", {"moisture": soil_moist_2}, time_now)
    log_sensor("CPU_TEMP", {"temp": cpu_temp}, time_now)
    log_sensor("PUMP", {"active": int(pump.value)}, time_now)
    log_sensor("PUMP_TIME", {"seconds": time.monotonic()-pump_timer}, time_now)
    log_sensor("TANK", {"empty": int(water_tank_alert)}, time_now)


def print_state():
    print(
        f"""
--PLANTER STATE--
Pump: {"On" if pump.value else "Off"}
Pump state: {pumping_state}
Pump time: {time.monotonic() - pump_timer}
Temp: {cpu_temp}
Soil 1: {soil_moist_1}
Soil 2: {soil_moist_2}
Soil state: {soil_state}
Water low: {water_tank_alert}
"""
    )


def control_actuators():
    # Pump
    global soil_state
    global pump_timer
    global pumping_state
    if pumping_state == 0 and (
        soil_state == 0 or time.monotonic() - pump_timer > 48 * 3600
    ):
        pump_timer = time.monotonic()
        pump.value = True
        log_sensor("PUMP", {"state": 1}, unix_time_now())
        pumping_state = 1
        soil_state = 1
    elif pumping_state == 1 and time.monotonic() - pump_timer > 3:
        pump_timer = time.monotonic()
        pump.value = False
        log_sensor("PUMP", {"state": 0}, unix_time_now())
        pumping_state = 2
    elif pumping_state == 2 and time.monotonic() - pump_timer > 120:
        pump_timer = time.monotonic()
        pumping_state = 0


def environment_calculations():
    # Soil moisture
    global soil_state
    global pumping_state
    if not pumping_state == 0:
        return
    mean_moisture = (soil_moist_1 + soil_moist_2) / 2
    if mean_moisture < 75:
        soil_state = 0
    elif mean_moisture > 80:
        soil_state = 1


def output_data() -> None:
    global http_session
    print_state()
    with open(SD_SENSOR_LOG_TEMP, "r") as f:
        data_to_post = f.read()
    print(data_to_post)
    print("Uploading to influxDB... ", end="")
    http_session.request(
        method="POST",
        url=INFLUXDB_SERVER_URL,
        data=data_to_post,
        headers={
            "Authorization": f"Token {INFLUXDB_API_TOKEN}",
            "Content-Type": "text/plain; charset=utf-8",
            "Accept": "application/json",
        },
    )
    print("Done!")
    with open(SD_SENSOR_LOG, "a") as f:
        f.write(data_to_post)
    open(SD_SENSOR_LOG_TEMP, "w").close()


def log_sensor(id: str, measurements: dict, date: int = None) -> None:
    current_date = date if not date is None else get_time_from_server()
    data_point = (
        f"{INFLUXDB_MEASUREMENT},sensor_id={id} "
        + ",".join([f"{key}={value}" for key, value in measurements.items()])
        + " "
        + str(current_date)
    )
    with open(SD_SENSOR_LOG_TEMP, "a") as f:
        f.write(data_point + "\n")


def tank_led_on():
    tank_led.switch_to_output(False)


def tank_led_off():
    tank_led.switch_to_input(pull=None)


def continuous_tasks():
    global water_tank_alert
    if tank_reset.count:
        tank_reset.reset()
        tank_sensor.reset()
        water_tank_alert = False
    if water_tank_alert:
        tank_led_on()
    else:
        tank_led_off()


def sleep_feed_ct(seconds) -> None:
    led.value = False
    start_time = time.monotonic()
    while time.monotonic() - start_time < seconds:
        time.sleep(0.5)
        feed_watchdog_ct()
    led.value = True


def get_time_from_server() -> int:
    global http_session
    response = http_session.get(TIME_SERVER_URL).json()
    return response["unixtime"]


def update_time_from_server() -> None:
    global server_time, last_fetched_server_time
    server_time = get_time_from_server()
    last_fetched_server_time = time.monotonic()


def unix_time_now() -> int:
    return int(server_time + int(time.monotonic() - last_fetched_server_time))


def dict_to_csv_string(data):
    values = [str(value) for value in data.values()]
    csv_string = ",".join(values)
    return csv_string


def feed_watchdog_ct(mark: str = None) -> None:
    continuous_tasks()
    if WATCHDOG_ENABLED:
        watchdog.feed()
    global watchdog_location
    if mark:
        watchdog_location = mark
        print(f"<>{mark}")

# On reset the monotonic time resets so
# each variable that holds monotonic time should be adjusted
def reset_monotonic_time():
    global old_monotonic
    global pump_timer
    global last_fetched_server_time
    pump_timer -= old_monotonic
    last_fetched_server_time -= old_monotonic


## MAIN PROGRAM
# Load previous session
load_locals()
reset_monotonic_time()

# Log reset
with open(SD_ERROR_LOG, "a") as elog:
    elog.write(f"{unix_time_now()}\t reset\t none\t {json.dumps(read_locals())}\n")

if WATCHDOG_ENABLED:
    start_watchdog()

feed_watchdog_ct("wifi")
http_session = wifi_connect(SSID, WPAKEY)

feed_watchdog_ct("server_time")
update_time_from_server()
small_timer = 0
while True:
    small_timer += 1
    led.value = water_tank_alert
    save_locals()
    feed_watchdog_ct("sleep")
    sleep_feed_ct(300 if pumping_state == 0 else 5)
    try:
        feed_watchdog_ct("environ")
        environment_calculations()
        save_locals()
        feed_watchdog_ct("actuators")
        control_actuators()
        save_locals()
        feed_watchdog_ct("sensors")
        read_sensors()
        save_locals()
        if small_timer > 1:
            small_timer = 0
            save_locals()
            feed_watchdog_ct("output")
            output_data()
            save_locals()
            feed_watchdog_ct("server_time")
            update_time_from_server()
            save_locals()
    except Exception as e:
        print(f"!~Exception occured: {e}")
        with open(SD_ERROR_LOG, "a") as elog:
            elog.write(
                f"{unix_time_now()}\t exception\t {e}\t {json.dumps(read_locals())}\n"
            )
