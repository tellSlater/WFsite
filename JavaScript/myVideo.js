function doVid(playButton) {
    var
        vid = playButton.parentNode.firstElementChild,
        preplay = playButton.parentNode.lastElementChild;
    if (vid.paused) {
        vid.play();
        playButton.style.backgroundPosition = "16px 0";
        preplay.style.display = "none";
        vid.ontimeupdate = function () { animProg(playButton.parentNode); };
    }
    else {
        vid.pause();
        playButton.style.backgroundPosition = "0 0";
        preplay.style.display = "block";
    }
}

function relocateVideo(e, hitboxdiv) {
    var viddiv = hitboxdiv.parentNode,
        vid = viddiv.firstElementChild,
        barlength = hitboxdiv.offsetWidth;
    if (isTouchDevice()) barlength *= 0.6;
    vid.currentTime = vid.duration * e.offsetX / barlength;
    animProg(viddiv);
}

function animProg(viddiv) {
    viddiv.querySelector('.progbar').style.width =
        String(100 * (viddiv.firstElementChild.currentTime / viddiv.firstElementChild.duration)) + "%";
}

function relocateVolume(e, volhitbox) {
    var viddiv = volhitbox.parentNode,
        vid = viddiv.firstElementChild,
        barheight = volhitbox.offsetHeight,
        clickheight = barheight - e.offsetY;
    if (isTouchDevice()) barheight *= 0.6;
    vid.volume = clickheight / barheight;
    animVol(viddiv, clickheight);
}

function animVol(viddiv, clickheight) {
    var volbar = viddiv.querySelector('.volbar');
    volbar.style.visibility = "visible";
    volbar.style.height = String(clickheight) + "px";

}

function doSpeaker(speaker) {
    var viddiv = speaker.parentNode,
        vid = viddiv.firstElementChild,
        volhitbox = viddiv.querySelector('.volbarHitbox'),
        volbar = viddiv.querySelector('.volbar');
    if (vid.volume > 0) {
        vid.volume = 0;
        speaker.style.backgroundPosition = "-9px 0";
        volbar.style.visibility = "hidden";
    }
    else {
        vid.volume = volbar.offsetHeight / volhitbox.offsetHeight;
        speaker.style.backgroundPosition = "0px 0";
        volbar.style.visibility = "visible";
    }
}

document.addEventListener("DOMContentLoaded", function (e) {

});

document.addEventListener('visibilitychange', function () {
    if (document.hidden) {

    }
    else {

    }
});


function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}