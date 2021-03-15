//Add jquery to head
// (function () {
// var script = document.createElement('script');
// script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
// script.type = 'text/javascript';
// document.getElementsByTagName('head')[0].appendChild(script);
// })();

//Changes the page colors depending on the current time
function backgroundDayColor(){
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

//Auto executes daylight stuff
document.addEventListener("DOMContentLoaded", function(){
    backgroundDayColor();					//Initial page coloring based on time of day
    setTimeout(transitionSet, 30);			//Adding transition is delayed by 30ms so that the first page coloring happens instantly
    setInterval(backgroundDayColor, 60000);	//Every 60s this script looks if there should be a change in sky coloring
});


//Play and pause audio
var paused = true;
function doAudio(AudioID) {
    var myAudio = document.getElementById(AudioID);
    if (!paused){
        document.getElementById("PlayPauseDesktop").style.backgroundPosition ="0px 0";
        document.getElementById("PlayPauseMobile").style.backgroundPosition ="0px 0";
        paused = true;
        $("audio").stop();
        $("audio").animate({volume:0}, 1000);
		var int_pause=setInterval(function(){
                if (document.getElementById("myAudio").volume == 0){
                    myAudio.pause();
                    clearInterval(int_pause);
                } 
            }, 100); //When audio volume falls to 0 pause audio and stop looking to pause

    }
    else{
        document.getElementById("PlayPauseDesktop").style.backgroundPosition ="-17px 0";
        document.getElementById("PlayPauseMobile").style.backgroundPosition ="-17px 0";
        paused = false;
        $("audio").stop();
        myAudio.play();
        $("audio").animate({volume:1}, 1000);
    }
}

function showPlay() //Shows the play button again when audio ends
{
    document.getElementById("PlayPauseDesktop").style.backgroundPosition ="0px 0";
    document.getElementById("PlayPauseMobile").style.backgroundPosition ="0px 0";
    document.getElementById("myAudio").volume = 0;
    paused = true;
}



//FOR REFERENCE

//interval
// var counter = 0;
// var i = setInterval(function(){
//     // do your thing

//     counter++;
//     if(counter === 10) {
//         clearInterval(i);
//     }
// }, 200);