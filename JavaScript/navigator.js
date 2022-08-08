//Code for the navigator element

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
    bdy = document.getElementsByTagName("body")[0], //Body element
    mn = document.getElementsByTagName("main")[0],  //Main element
    nav = document.getElementsByClassName("navigator")[0],  //Navigator div
    
    //Elements inside navigator (gets refreshed on adding elements)
    elems = document.getElementsByClassName("navigator")[0].children,

    maxElemWidth = 0,   //Calculated bellow based on added navigator elements

    //Left padding of main
    mainPadding = parseInt(window.getComputedStyle(mn, null).getPropertyValue('padding-left').slice(0,-2)),

    titles; //Will contain titles of the sections of the page

    //Filling the navigator with the proper HTML and setting IDs for the sections of the page for linking
    titles = document.getElementsByTagName("main")[0].getElementsByTagName("h3");
    for (let i = 0; i < titles.length; i++) {
        var tempID = (titles[i].innerHTML.replace(/\s/g, "")).toString();
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

    ///////////////////////////////////////////////////////////////////////
    //Code used for setting an index to the current section being browsed//
    ///////////////////////////////////////////////////////////////////////

    //Saving original titles (without the index)
    const strTitles = [];
    for (let i=0; i < elems.length; ++i) {
        strTitles[i] = titles[i].innerHTML.trim();
    }

    //Removes index from all navigator elements
    function deindexAll() {
        for (let i=0; i < elems.length; ++i) {
            elems[i].children[0].innerHTML = strTitles[i];
        }
    }

    //Adds index to ith navigator element
    function index_i(i) {
        elems[i].children[0].innerHTML = '>' + strTitles[i];
    }

    //Add index to the navigator elements on click
    for (let i=0; i < elems.length; ++i) {
        elems[i].addEventListener("click", function(e) {
            //Timeout used here for being the last sections that sets the indexes
            //because bottom titles never scroll to top
            setTimeout( function () {
                deindexAll();
                index_i(i);
            }, 2);
        });
    }

    //Add index to the navigator elements on scroll
    bdy.addEventListener("scroll", function (e) {

        //When scrolled to top no item has index
        if (nav.offsetTop < titles[0].offsetTop + 20) {
            deindexAll();
            return;
        }

        var i = 0;
        while (nav.offsetTop > titles[i].offsetTop) {
            ++i
            if (i >= titles.length) break;
        }
        deindexAll();
        index_i(i-1);
	});

}


if (document.readyState !== "loading") {
    initCode();
} else {
    document.addEventListener("DOMContentLoaded", function () {
        initCode();
    });
    
}