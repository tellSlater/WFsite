//Code for the navigator element

var titles; //Array of h3 in main - titles of the page sections

//Sleep milliseconds function
function sleep(miliseconds) {
    var currentTime = new Date().getTime();
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
}

function initCode(e) {
    const
    navWidth = 120;

    var
    bdy = document.getElementsByTagName("body")[0],
    mn = document.getElementsByTagName("main")[0],
    nav = document.getElementsByClassName("navigator")[0],
    elems = document.getElementsByClassName("navigator")[0].children,
    maxElemWidth = 0,
    mainPadding = parseInt(window.getComputedStyle(mn, null).getPropertyValue('padding-left').slice(0,-2));

    //Filling the navigator with the proper HTML and setting IDs for the sections of the page for linking
    titles = document.getElementsByTagName("main")[0].getElementsByTagName("h3");
    for (let i = 0; i < titles.length; i++) {
        var tempID = (titles[i].innerHTML.replace(/\s/g,'').slice(0,6)).toString();
        nav.innerHTML += '<a href="#' + tempID + '"><h4>' + titles[i].innerHTML + '</h4></a>';
        titles[i].id = tempID;
    }

    //Background color fitting body bg color
    var tempColor = bdy.style.getPropertyValue('background-color');
    tempColor = tempColor.slice(0, -1) + ', 0.9)';
    nav.style.backgroundColor = tempColor;

    //This must be calculated after some timeout so that the styles are properly loaded - google font must be slower to load
    setTimeout(function(){

        //Calc max width of extended navigator
        maxElemWidth = nav.scrollWidth;

        //Create new :hover css rule for appropriate width expansion on hover
        var css = 'div.navigator:hover {max-width: ' + (maxElemWidth + 16) + 'px;}';
        var style = document.createElement('style');
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        document.getElementsByTagName('head')[0].appendChild(style);

    }, 150);

    //Setting bottom margin to negative so that navigator occupies no vertical space
    var
    elMargin = elems[0].children[0].offsetTop,
    elHeight = elems[0].children[0].clientHeight;
    nav.style.marginBottom = '-' + (elems.length * (elHeight + elMargin) + elMargin + 20).toString() + 'px';


    //Add the transition property after some time so that everything is in place already and colored properly
    setTimeout( function(){
        nav.style.transition = "all 0.2s, background-color 10s";
    }, 150);

    //Change background color when day light changes by listening to event "bgColorChange"
    document.addEventListener("bgColorChange", function() {
        var tempColor = bdy.style.getPropertyValue('background-color');
        tempColor = tempColor.slice(0, -1) + ', 0.9)';
        nav.style.backgroundColor = tempColor;
    });

    //Adjust navigator width when page is loaded according to window dimensions
    var sidespace = (bdy.clientWidth - (mn.offsetWidth - 2*mainPadding)) / 2;
    if (sidespace < navWidth+16) {
        nav.style.maxWidth = (sidespace - 16).toString() + "px";
        //nav.style.left = "calc(50% - " + ((paper.clientWidth - navWidth) / 2 + sidespace - 8).toString() + "px)";
    }
    else {
        nav.style.maxWidth = navWidth + "px";
        //nav.style.left = "calc(50% - 565px)"
    }

    //Adjust width every time window is resized
    window.addEventListener('resize', function (e) {
        var sidespace = (bdy.clientWidth - (mn.offsetWidth - 2*mainPadding)) / 2;

		nav.style.transition = "all 0s";

		if (sidespace < navWidth+16) {
            nav.style.maxWidth = (sidespace - 16).toString() + "px";
			//sidebar.style.left = "calc(50% - " + ((paper.clientWidth - 128) / 2 + sidespace - 8).toString() + "px)";
		}
		else {
            nav.style.maxWidth = navWidth + "px";
			//sidebar.style.left = "calc(50% - 532px)"
		}

        setTimeout( function(){
            nav.style.transition = "all 0.2s, background-color 10s";
        }, 50);
	});

    //Extending the navigator on mouseover
    nav.addEventListener('mouseover', function () {
        nav.style.maxWidth = (maxElemWidth+16).toString() + 'px';
    });

    //Retracting the navigator on mouseleave
    nav.addEventListener('mouseleave', function () {
        var sidespace = (bdy.clientWidth - (mn.offsetWidth - 2*mainPadding)) / 2;

		if (sidespace < navWidth+16) {
            nav.style.maxWidth = (sidespace - 16).toString() + "px";
			//sidebar.style.left = "calc(50% - " + ((paper.clientWidth - 128) / 2 + sidespace - 8).toString() + "px)";
		}
		else {
            nav.style.maxWidth = navWidth + "px";
			//sidebar.style.left = "calc(50% - 532px)"
		}

    });



}


if (document.readyState !== "loading") {
    initCode();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        initCode();
    });
    
}