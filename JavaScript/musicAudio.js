//Play and pause audio
var
    paused = true,
    volumeSLIDER = 1,
    canim = 0,
    tipShown = false,
    prevAudio,
    currentAudio,
    intAudioStepping;

//Shows a tip for using the player when play is pressed for the first time
function showTip() {
    if (!tipShown) {
        document.querySelector(".voltip").style.display = "inline";
        setTimeout(function () {
            document.querySelector(".voltip").style.display = "none";
        }, 10000); //When audio volume falls to 0 pause audio and stop looking to pause
        tipShown = true;
    }
}

//Hides button 1 - shows button 2
function pressPlay() {
    document.querySelector(".B1").style.display = "none";
    document.querySelector(".B2").style.display = "inline";
}

//Hides button 2 - shows button 1
function pressPause() {
    document.querySelector(".B1").style.display = "inline";
    document.querySelector(".B2").style.display = "none";
}

//Shows both when a song ends
function pressEnd() {
    document.querySelector(".B1").style.display = "inline";
    document.querySelector(".B2").style.display = "inline";
}

//Hides button 3
function pressRW() {
    document.querySelector(".B3").style.opacity = "0";
}
//Shows button 3
function releaseRW() {
    document.querySelector(".B3").style.opacity = "1";
}

//Hides button 4
function pressFF() {
    document.querySelector(".B4").style.opacity = "0";
}
//Shows button 4
function releaseFF() {
    document.querySelector(".B4").style.opacity = "1";
}

//Does the song changes and fade-in/out when play/pause is pressed
function doAudio(aud) {
    showTip();
    prevAudio = currentAudio;
    currentAudio = aud;


    //pause previous audio
    pressPause();
    prevAudio.parentNode.querySelector('.playpause').style.backgroundPosition = "0px 0";
    prevAudio.parentNode.style.border = "none";

    //activate current element
    currentAudio.parentNode.style.borderLeft = "12px solid #445ff6";

    //if new element rewind audio first and set initial volume to 0
    if (prevAudio != currentAudio) {
        //currentAudio.currentTime = 0;
        currentAudio.volume = 0;
    }

    //always pause previous audio first
    $(prevAudio).stop();
    $(prevAudio).animate({ volume: 0 }, 100, 'linear', function () {
        prevAudio.pause();
    });

    if (!paused && (prevAudio == currentAudio)) {
        paused = true;
    }
    else {
        pressPlay();
        activateB2();
        currentAudio.parentNode.querySelector('.playpause').style.backgroundPosition = "-17px 0";
        paused = false;
        $(currentAudio).stop();
        if (currentAudio.currentTime === currentAudio.duration) currentAudio.currentTime -= 0.2;
        currentAudio.play();
        $(currentAudio).animate({ volume: volumeSLIDER }, 100, 'linear');
    }

    animateProgBar();
}

//Makes button 2(pause) pressable (only when a song is playing)
function activateB2() {
    var B2 = document.querySelector('.B2');
    B2.style.cursor = "pointer";
    B2.onmousedown = doAudio.bind(null, currentAudio);
}

//Deactivates functionality of button 2 when a song is not playing
function deactivateB2() {
    var B2 = document.querySelector('.B2');
    B2.style.cursor = "context-menu";
    B2.onmousedown = null;
}

//Starts an interval that steps through the song a given "step" every "delay" milliseconds
function startStepping(step, delay) {
    clearInterval(intAudioStepping);
    releaseFF();
    releaseRW();
    step < 0 ? pressRW() : pressFF();
    intAudioStepping = setInterval(function () {
        doAudioStep(step);
    }, delay);
}

//Executed when left arrow is pressed
function pressLeftArrow() {
    startStepping(-2, 43)
}

//Executed when right arrow is pressed
function pressRightArrow() {
    startStepping(2, 43)
}

//Shows play and does some settings when a song ends
function showPlay(thisaudio) //Shows the play button again when audio ends
{
    if (paused) return;
    thisaudio.parentNode.querySelector('.playpause').style.backgroundPosition = "0px 0";
    thisaudio.volume = 0;
    paused = true;
    //currentAudio.currentTime = 0;
    pressEnd();
    deactivateB2();

    animateProgBar();
}

//Updates the volumeSLIDER parameter that is used to indicate the volume while playing
//(volume of audio is altered when fading-in/out so keeping the master volume must be kept in a variable)
function updateVolume(vol) {
    volumeSLIDER = (Number(vol) + 0.1) / 100.1;
    if (!paused)
        currentAudio.volume = volumeSLIDER;
}

//Progresses the animation of the cassette a given step
function animateCassette(step) {
    canim += step;
    if (canim < 0)
        canim = 3;
    else if (canim > 3)
        canim = 0;
    document.getElementById("cass").style.backgroundPosition = String(11 * canim) + "px 0";
}

//Animates the progress bar to correspond to the current songs time
function animateProgBar() {
    document.querySelector('.RADIOprogress').style.width = String(114 * (currentAudio.currentTime / currentAudio.duration)) + "px";
}

//Relocates audio based on a click event
function doAudioReloc(e) {
    currentAudio.currentTime = currentAudio.duration * e.offsetX / 113;
    animateProgBar();
}

//Steps current audio "step" seconds
function doAudioStep(step) {
    if (step < 0) {
        if (currentAudio.currentTime > -step) {
            currentAudio.currentTime += step;
            animateCassette(1);
        }
        else
            currentAudio.currentTime = 0;
    }
    else {
        if ((currentAudio.duration - currentAudio.currentTime) > step) {
            currentAudio.currentTime += step;
            animateCassette(-1);
        }
        else
            currentAudio.currentTime = currentAudio.duration;
    }
    animateProgBar();
}


//Changes volume by altering the position of the volume slider(or range input)
function doAudioVolume(step) {
    step *= 100.0;
    if (step < 0) {
        if (document.getElementById("volslider").valueAsNumber > -step)
            document.getElementById("volslider").valueAsNumber += step;
        else
            document.getElementById("volslider").valueAsNumber = 0;
    }
    else {
        if (100 - document.getElementById("volslider").valueAsNumber > step)
            document.getElementById("volslider").valueAsNumber += step;
        else
            document.getElementById("volslider").valueAsNumber = 100;
    }

    updateVolume(document.getElementById("volslider").valueAsNumber);
}

//Animates cassette and progress bar when not paused
function animateAll() {
    if (!paused) {
        animateCassette(-1);
        animateProgBar();
    }
}

//Sets animation interval after content is loaded
//And also loads default audio files
//Handles keyboard and touchscreen inputs
var spaceDown = false,
    rightDown = false,
    leftDown = false;
document.addEventListener("DOMContentLoaded", function (e) {
    setInterval(animateAll, 400);

    prevAudio = document.getElementById("audio0");
    currentAudio = document.getElementById("audio0");

    document.body.onkeydown = function (e) {
        //if (isTouchDevice()) return;
        if (e.keyCode == 32) {
            if (spaceDown) return;
            doAudio(currentAudio);
            spaceDown = true;
        }
        if (e.keyCode == 37) {
            if (leftDown) return;
            startStepping(-2, 43)
            leftDown = true;
        }
        if (e.keyCode == 39) {
            if (rightDown) return;
            startStepping(2, 43)
            rightDown = true;
        }
        if (e.keyCode == 38) {
            doAudioVolume(0.05);
        }
        if (e.keyCode == 40) {
            doAudioVolume(-0.05);
        }
        if (e.keyCode == 84) { //Logging of device is touch for debugging
            console.log(isTouchDevice());
        }
    };
    document.body.onkeyup = function (e) {
        //if (isTouchDevice()) return;
        if (e.keyCode == 32) {
            spaceDown = false;
        }
        if (e.keyCode == 37) {
            releaseFF();
            releaseRW();
            clearInterval(intAudioStepping);
            leftDown = false;
        }
        if (e.keyCode == 39) {
            releaseFF();
            releaseRW();
            clearInterval(intAudioStepping);
            rightDown = false;
        }
    };
    document.body.onmouseup = function (e) {
        releaseFF();
        releaseRW();
        clearInterval(intAudioStepping);
    }
    document.body.ontouchend = function (e) {
        releaseFF();
        releaseRW();
        clearInterval(intAudioStepping);
    }


});

$(".B1").on("contextmenu", function () {
    return false;
});
$(".B2").on("contextmenu", function () {
    return false;
});
$(".B3").on("contextmenu", function () {
    return false;
});
$(".B4").on("contextmenu", function () {
    return false;
});

//Detects if the page opened on a touchscreen device
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}