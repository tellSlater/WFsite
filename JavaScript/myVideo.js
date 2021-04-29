function doVid(playButton)
{ 
    var
    vid = playButton.parentNode.firstElementChild,
    preplay = playButton.parentNode.lastElementChild;
    if (vid.paused)
    {
        vid.play();
        playButton.style.backgroundPosition = "16px 0";
        preplay.style.display = "none";
        vid.ontimeupdate = function(){animProg(playButton.parentNode);};
    }
    else
    {
        vid.pause();
        playButton.style.backgroundPosition = "0 0";
        preplay.style.display = "block";
    }
}

function animProg(viddiv)
{
    viddiv.querySelector('.progbar').style.width =
    String(100 * (viddiv.firstElementChild.currentTime / viddiv.firstElementChild.duration)) + "%";
}

document.addEventListener("DOMContentLoaded", function(e)
{

});

document.addEventListener('visibilitychange', function() {
    if(document.hidden) {
        
    }
    else {
        
    }
});