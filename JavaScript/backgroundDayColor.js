//Changes the page colors depending on the current time

// This event will be triggered when background color changes so that
// any other elements can listen to this event and change their color accordingly
const bgColorChange = new CustomEvent("bgColorChange");

//This object has functions for getting the sunrise and sunset times around the year
const sunPos = {
    //returns true if it is day

    //returns true if it is night

    //Takes month as a float and returns mins for sunrise until start of day (accepts values of 1 to 12.99)
    sunriseMonthToMins: function (month) {
        var p = [351.2049, 134.5696, -67.21557, 10.71047, -0.6945487, 0.01614819];
        return (
            p[0] +
            p[1] * month +
            p[2] * month * month +
            p[3] * month * month * month +
            p[4] * month * month * month * month +
            p[5] * month * month * month * month * month
        );
    },

    //Takes month as a float and returns mins for sunset until start of day
    sunsetMonthToMins: function (month) {
        var p = [1016.381, 19.59007, 0.7721402, 1.204695, -0.2559946, 0.0115856];
        return (
            p[0] +
            p[1] * month +
            p[2] * month * month +
            p[3] * month * month * month +
            p[4] * month * month * month * month +
            p[5] * month * month * month * month * month
        );
    },

    //takes a Date object and returns 0 to 3 for night, sunrise, day, sunset - the current phase of the day
    dayPhase: function (h) {
        if (!(h instanceof Date)) {
            console.log("dayPhase function argument was not a Date object");
            return NULL;
        }
        var m = h.getMonth() + 1,
            d = h.getDate(),
            md = m + d / 30,
            minsNow = h.getHours() * 60 + h.getMinutes(),
            savingsHour = 0,
            nowItIs = 0;

        //Checks for saving hour
        if (h.getMonth() > 1 && h.getMonth() < 9) {
            savingsHour = 1;
        } else if (h.getMonth() == 1) {
            const lastDate = new Date(h.getFullYear(), h.getMonth(), 31);
            var lastDay = lastDate.getDay();
            if (h.getDate() >= 31 - lastDay) savingsHour = 1;
        } else if (h.getMonth() == 9) {
            const lastDate = new Date(h.getFullYear(), h.getMonth(), 31);
            var lastDay = lastDate.getDay();
            if (h.getDate() < 31 - lastDay) savingsHour = 1;
        }

        if (minsNow < sunPos.sunriseMonthToMins(md) + savingsHour * 60) {
            nowItIs = 0;
        } else if (minsNow < sunPos.sunriseMonthToMins(md) + savingsHour * 60 + 30) {
            nowItIs = 1;
        } else if (minsNow < sunPos.sunsetMonthToMins(md) + savingsHour * 60) {
            nowItIs = 2;
        } else if (minsNow < sunPos.sunsetMonthToMins(md) + savingsHour * 60 + 30) {
            nowItIs = 3;
        } else {
            nowItIs = 0;
        }

        return nowItIs;
    },
};

function backgroundDayColor() {
    var h = new Date(),
        dayPhase = sunPos.dayPhase(h);
    dayPhase = 0;
    if (dayPhase == 0) {
        document.body.style.backgroundColor = "#e0cba4";
        document.getElementById("sky").style.backgroundColor = "#464646";
    } else if (dayPhase == 1 || dayPhase == 3) {
        document.body.style.backgroundColor = "#f7d7ab";
        document.getElementById("sky").style.backgroundColor = "#ffb788";
    } else {
        document.body.style.backgroundColor = "#efe1c5";
        document.getElementById("sky").style.backgroundColor = "#d5ecff";
    }

    // //This segment code helps debug by changing background every minute in stead of hour

    // if (h.getMinutes()%3 === 0) {
    //     document.body.style.backgroundColor = "#e0cba4";
    //     document.getElementById("sky").style.backgroundColor = "#464646";
    // }
    // else if (h.getMinutes()%3 === 1) {
    //     document.body.style.backgroundColor = "#f7d7ab";
    //     document.getElementById("sky").style.backgroundColor = "#ffb788";
    // }
    // else if (h.getMinutes()%3 === 2) {
    //     document.body.style.backgroundColor = "#efe1c5";
    //     document.getElementById("sky").style.backgroundColor = "#d5ecff";
    // }

    //Dispatches event "bgColorChange" so that other elements can change their colors in unison
    document.dispatchEvent(bgColorChange);
}

//Sets transition for backgrounds to 10s
function transitionSet() {
    document.body.style.transitionDuration = "10s";
    document.getElementById("sky").style.transitionDuration = "10s";
}

//Auto executes daylight stuff
document.addEventListener("DOMContentLoaded", function () {
    backgroundDayColor(); //Initial page coloring based on time of day
    setTimeout(transitionSet, 30); //Adding transition is delayed by 30ms so that the first page coloring happens instantly
    setInterval(backgroundDayColor, 60000); //Every 60s this script looks if there should be a change in sky coloring
});
