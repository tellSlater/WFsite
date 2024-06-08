function set_day_color(day_phase) {
    // 0 - night
    // 1 - morning
    // 2 - day
    // 3 - evening
    if (day_phase == 0) {
        document.body.style.backgroundColor = "#e0cba4";
        document.getElementById("sky").style.backgroundColor = "#464646";
    } else if (day_phase == 1 || day_phase == 3) {
        document.body.style.backgroundColor = "#f7d7ab";
        document.getElementById("sky").style.backgroundColor = "#ffb788";
    } else {
        document.body.style.backgroundColor = "#efe1c5";
        document.getElementById("sky").style.backgroundColor = "#d5ecff";
    }
}

//Sets transition for backgrounds to 10s
function set_transition_day() {
    document.body.style.transitionDuration = "3s";
    document.getElementById("sky").style.transitionDuration = "3s";
}

let CHROMA = 360;
let rainbow_letters = "";

function rainbow_letters_transition(sec) {
    rainbow_letters.forEach((letters) => {
        letters.style.transition = "color " + sec + "s";
    });
}
function rainbow_letters_hue(hue, brightness = 50) {
    rainbow_letters.forEach((letters) => {
        letters.style.color = `hsl(${hue - 130}, 100%, ${brightness}%)`;
    });
}

function page_universe(init_do, forever_do, delay, repeat) {
    init_do();
    setTimeout(function () {
        forever_do();
        setInterval(forever_do, repeat);
    }, delay);
}

document.addEventListener("DOMContentLoaded", function () {
    rainbow_letters = document.querySelectorAll(".rainbow_letters");
});
