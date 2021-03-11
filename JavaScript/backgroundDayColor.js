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
}
