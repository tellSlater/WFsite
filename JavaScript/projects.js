//Does the sorting and easy/normal/hard toggling on the projects page
var
by = "",
easy = false,
normal = false,
hard = false;


function sortProjects(btn){
    if ((by != "RANDOM") && (by === btn.innerHTML)) return;
    else by = btn.innerHTML;

    $(".cursor").css("display", "none");
    btn.parentNode.childNodes[3].style.display="block";
    btn.parentNode.childNodes[5].style.display="block";

    $(".sortBtn h3").css("cursor", "pointer");
    if (btn.parentNode.childNodes[1].innerHTML != "RANDOM")
    {
        btn.parentNode.childNodes[1].style.cursor="context-menu";
        btn.parentNode.childNodes[3].style.cursor="context-menu";
        btn.parentNode.childNodes[5].style.cursor="context-menu";
    }
}


function toggleDiff(btn){
var dashed = false;

    switch (btn.parentNode.childNodes[1].innerHTML)
    {
        case "EASY":
            easy = !easy;
            dashed = easy;
            break;
        case "NORMAL":
            normal = !normal;
            dashed = normal;
            break;
        case "HARD":
            hard = !hard;
            dashed = hard;
            break;
        default:
            console.log("No match for switch in toggleDiff function")
    }

    if (dashed) btn.parentNode.childNodes[3].style.display="block";
    else btn.parentNode.childNodes[3].style.display="none";

}







//Auto executes on page load
document.addEventListener("DOMContentLoaded", function(){
    sortProjects(document.getElementById("DATE"));

});