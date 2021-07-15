function startPlayer(preplay) {
    var viddiv = preplay.parentNode,
        vid = viddiv.firstElementChild;
    vid.play();
    vid.controls = true;
    preplay.style.display = "none";
}