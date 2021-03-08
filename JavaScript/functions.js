//Changes the page colors depending on the current time
function backgroundDayColor() {
    var h = new Date;
    if (h.getHours() < 6) {
        document.body.style.backgroundColor = "#e0cba4";
        document.getElementById("sky").style.backgroundColor = "#464646";
    }
    else if (h.getHours() < 7) {
        document.body.style.backgroundColor = "#f7d7ab";
        document.getElementById("sky").style.backgroundColor = "#ffb788";
    }
    else if (h.getHours() < 19) {
        document.body.style.backgroundColor = "#efe1c5";
        document.getElementById("sky").style.backgroundColor = "#d5ecff";
    }
    else if (h.getHours() < 20) {
        document.body.style.backgroundColor = "#f7d7ab";
        document.getElementById("sky").style.backgroundColor = "#ffb788";
    }
    else {
        document.body.style.backgroundColor = "#e0cba4";
        document.getElementById("sky").style.backgroundColor = "#464646";
    }

    //This segment code helps debug by changing background every minute in stead of hour
    //
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
}

//Sets transition for backgrounds to 10s
function transitionSet() {
    document.body.style.transitionDuration = "10s";
    document.getElementById("sky").style.transitionDuration = "10s";
}

//Play and pause audio

function doAudio(AudioID) {
    var myAudio = document.getElementById(AudioID);
    if (!(myAudio.paused)){
    myAudio.pause();
    document.getElementById("PlayPauseDesktop").style.backgroundPosition ="0px 0";
    document.getElementById("PlayPauseMobile").style.backgroundPosition ="0px 0";
    }
    else{
    myAudio.play();
    document.getElementById("PlayPauseDesktop").style.backgroundPosition ="-17px 0";
    document.getElementById("PlayPauseMobile").style.backgroundPosition ="-17px 0";
    }
}

function showPlay()
{
    document.getElementById("PlayPauseDesktop").style.backgroundPosition ="0px 0";
    document.getElementById("PlayPauseMobile").style.backgroundPosition ="0px 0";
}
