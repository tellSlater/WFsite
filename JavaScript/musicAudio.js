//Play and pause audio
var
paused = true,
volumeSLIDER = 1,
canim = 0,
prevAudio,
currentAudio;



function doAudio(playb) {
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
    }
}

function showPlay(thisaudio) //Shows the play button again when audio ends
{
    thisaudio.parentNode.querySelector('.playpause').style.backgroundPosition ="0px 0";
    thisaudio.volume = 0;
    paused = true;
}

function updateVolume(vol)
{
    volumeSLIDER = (Number(vol) + 0.1) / 100.1;
    currentAudio.volume = volumeSLIDER;
}

function updateVolumeCon()
{
    var vol;
    vol = document.getElementById("volslider").value;
    volumeSLIDER = (Number(vol) + 0.1) / 100.1;
    currentAudio.volume = volumeSLIDER;
}



function pauseAudio()
{

}

function animateCassette()
{
    if (!paused)
    {  
        canim===0 ? canim = 3 : canim--;
    }
    document.getElementById("cass").style.backgroundPosition = String(11 * canim) + "px 0";
}

(function(){

})();



document.addEventListener("DOMContentLoaded", function(e)
{
    setInterval(animateCassette, 400);

    // setInterval(updateVolumeCon, 150)

    prevAudio = document.getElementById("audio0");
    currentAudio = document.getElementById("audio0");
    
    document.getElementById("volslider").addEventListener("change", function(e){
    updateVolumeCon();
    });
});