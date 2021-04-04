//Play and pause audio
var
paused = true,
volumeSLIDER = 1,
canim = 0,
tipShown = false,
prevAudio,
currentAudio;

function showTip()
{
    if (!tipShown)
    {
        document.querySelector(".voltip").style.display = "inline";
        setTimeout(function(){
            document.querySelector(".voltip").style.display = "none";
        }, 10000); //When audio volume falls to 0 pause audio and stop looking to pause
        tipShown = true;
    }
}

function pressPlay()
{
    document.querySelector(".B1").style.display = "none";
    document.querySelector(".B2").style.display = "inline";
}

function pressPause()
{
    document.querySelector(".B1").style.display = "inline";
    document.querySelector(".B2").style.display = "none";
}

function pressEnd()
{
    document.querySelector(".B1").style.display = "inline";
    document.querySelector(".B2").style.display = "inline";
}



function doAudio(playb)
{
    showTip();
    prevAudio = currentAudio;
    currentAudio = playb.parentNode.lastElementChild;


    //pause previous audio
    prevAudio.parentNode.querySelector('.playpause').style.backgroundPosition = "0px 0";
    prevAudio.parentNode.style.border = "none";
    
    //activate current element
    currentAudio.parentNode.style.borderLeft = "12px solid #445ff6";

    //if new element rewind audio first and set initial volume to 0
    if (prevAudio != currentAudio)
    {
        currentAudio.currentTime = 0;
        currentAudio.volume = 0;
    }

    //always pause previous audio first
    $(prevAudio).stop();
    $(prevAudio).animate({volume:0}, 150);
    pressPause();
    var prev_pause=setInterval(function(){
            if (prevAudio.volume == 0){
                prevAudio.pause();
                clearInterval(prev_pause);
            } 
        }, 100); //When audio volume falls to 0 pause audio and stop looking to pause

    if (!paused && (prevAudio == currentAudio))
    {
        paused = true;
    }
    else
    {
        currentAudio.parentNode.querySelector('.playpause').style.backgroundPosition = "-17px 0";
        paused = false;
        $(currentAudio).stop();
        currentAudio.play();
        $(currentAudio).animate({volume:volumeSLIDER}, 150);
        pressPlay();
    }
}

function showPlay(thisaudio) //Shows the play button again when audio ends
{
    thisaudio.parentNode.querySelector('.playpause').style.backgroundPosition ="0px 0";
    thisaudio.volume = 0;
    paused = true;
    currentAudio.currentTime = 0;
    pressEnd();
}

function updateVolume(vol)
{
    volumeSLIDER = (Number(vol) + 0.1) / 100.1;
    currentAudio.volume = volumeSLIDER;
}

function animateCassette()
{
    if (!paused)
    {  
        canim===0 ? canim = 3 : canim--;
    }
    document.getElementById("cass").style.backgroundPosition = String(11 * canim) + "px 0";
}

function animateProgBar()
{
    document.querySelector('.progress').style.width = String(114 * (currentAudio.currentTime / currentAudio.duration)) + "px";
}

function animateAll()
{
    animateCassette();
    animateProgBar();
}



document.addEventListener("DOMContentLoaded", function(e)
{
    setInterval(animateAll, 400);

    prevAudio = document.getElementById("audio0");
    currentAudio = document.getElementById("audio0");
});