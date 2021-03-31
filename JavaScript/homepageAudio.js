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