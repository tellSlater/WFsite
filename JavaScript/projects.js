//All scripts needed in the projects page
var
    by = "",            //Property that the list of projects is sorted by
    easy = true,        //Visibility of easy projects
    normal = true,      //Visibility of normal projects
    hard = true;        //Visibility of hard projects

//Does the sorting
function sortProjects(btn) {
    var
        divs = document.getElementById("main").childNodes,
        a = [],
        i = 0;

    for (i = 0; i < divs.length; i++) {
        if (divs[i].tagName == 'DIV')
            a.push(divs[i].childNodes[1])
        if (divs[i].tagName == 'PROJECT-BOX')
            a.push(divs[i].childNodes[1].childNodes[1])
    }

    if ((by != "RANDOM") && (by === btn.innerHTML)) return;
    else by = btn.innerHTML;

    $(".cursor").css("display", "none");
    btn.parentNode.childNodes[3].style.display = "block";
    btn.parentNode.childNodes[5].style.display = "block";

    $(".sortBtn .by").css("cursor", "pointer");
    if (btn.parentNode.childNodes[1].innerHTML != "RANDOM") {
        btn.parentNode.childNodes[1].style.cursor = "context-menu";
        btn.parentNode.childNodes[3].style.cursor = "context-menu";
        btn.parentNode.childNodes[5].style.cursor = "context-menu";
    }

    switch (by) {
        case "DATE":
            a.sort(function (a, b) {
                var
                    da = Date.parse(a.childNodes[5].innerHTML),
                    db = Date.parse(b.childNodes[5].innerHTML);
                return da == db ? 0 : (da > db ? -1 : 1);
            });
            break;
        case "NAME":
            a.sort(function (a, b) {
                var
                    na = a.childNodes[3].innerHTML,
                    nb = b.childNodes[3].innerHTML;
                return na == nb ? 0 : (na < nb ? -1 : 1);
            });
            break;
        case "RANDOM":
            shuffle(a);
            break;
        default:
            console.log("ERROR - No match for switch in sortProjects function")
    }

    document.getElementById("main").innerHTML = "";

    for (i = 0; i < a.length; i++) {
        document.getElementById("main").appendChild(a[i].parentNode);
    }
}

//Toggles easy/normal/hard projects visibility
function toggleDiff(btn) {

    var
        dashed = false,
        divs = document.getElementById("main").childNodes,
        a = [],
        i = 0;

    for (i = 0; i < divs.length; i++) {
        if (divs[i].tagName == 'DIV')
            a.push(divs[i].childNodes[1])
    }

    switch (btn.parentNode.childNodes[1].innerHTML) {
        case "EASY":
            easy = !easy;
            dashed = !easy;
            display(easy, "EASY");
            break;
        case "NORMAL":
            normal = !normal;
            dashed = !normal;
            display(normal, "NORMAL");
            break;
        case "HARD":
            hard = !hard;
            dashed = !hard;
            display(hard, "HARD");
            break;
        default:
            console.log("ERROR - No match for switch in toggleDiff function")
    }

    if (dashed) btn.parentNode.childNodes[3].style.opacity = "1";
    else btn.parentNode.childNodes[3].style.opacity = "0";

    function display(disp, diff) {
        for (i = 0; i < a.length; i++) {
            if (a[i].childNodes[7].innerHTML.search(diff) + 1) {
                if (disp) {
                    a[i].parentNode.style.display = "inline-block";
                }
                else {
                    a[i].parentNode.style.display = "none";
                }
            }
        }
    }

}

//Shuffles a JS array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


//Auto executes on page load
document.addEventListener("DOMContentLoaded", function () {

    sortProjects(document.getElementById("DATE"));

});