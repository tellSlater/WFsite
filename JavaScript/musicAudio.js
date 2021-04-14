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



function doAudio(aud)
{
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
    if (prevAudio != currentAudio)
    {
        currentAudio.currentTime = 0;
        currentAudio.volume = 0;
    }

    //always pause previous audio first
    $(prevAudio).stop();
    $(prevAudio).animate({volume:0}, 100, 'linear', function(){
        prevAudio.pause();
    } );

    if (!paused && (prevAudio == currentAudio))
    {
        paused = true;
    }
    else
    {
        pressPlay();
        activateB2();
        currentAudio.parentNode.querySelector('.playpause').style.backgroundPosition = "-17px 0";
        paused = false;
        $(currentAudio).stop();
        currentAudio.play();
        $(currentAudio).animate({volume:volumeSLIDER}, 100, 'linear');
    }
}

function activateB2()
{
    var B2 = document.querySelector('.B2');
    B2.style.cursor = "pointer";
    B2.onclick = doAudio.bind(null, currentAudio);
}

function deactivateB2()
{
    var B2 = document.querySelector('.B2');
    B2.style.cursor = "context-menu";
    B2.onclick = null;
}

function showPlay(thisaudio) //Shows the play button again when audio ends
{
    thisaudio.parentNode.querySelector('.playpause').style.backgroundPosition ="0px 0";
    thisaudio.volume = 0;
    paused = true;
    currentAudio.currentTime = 0;
    pressEnd();
    deactivateB2();
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

    document.body.onkeyup = function(e){
        if(e.keyCode == 32){
            doAudio(currentAudio);
        }
    };

});