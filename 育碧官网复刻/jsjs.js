var hadClick = 0;
/*搜索栏*/
let searchButton = document.querySelector(".searchButton");
let searchBtn = document.querySelector("#searchBtn");
let search = document.querySelector(".search");
let icon = document.querySelector(".icon");
searchButton.addEventListener('click', function () {
    if (searchBtn.getAttribute('class') === 'searchTextHid') {
        searchBtn.setAttribute('class', 'searchText');
        search.style.backgroundColor = "white";
        icon.src = "img/blacksearch.png"
    } else {
        searchBtn.setAttribute('class', 'searchTextHid');
        search.style.backgroundColor = "black";
        icon.src = "img/search.png"
    }
});
/*箭头*/
let dot = document.querySelectorAll(".dot");
let arrowL = document.querySelector(".arrowsL");
let arrowR = document.querySelector(".arrowsR");
let exploreBox = document.querySelector("#exploreBox");
arrowL.onclick = function () {
    var num = dot.length;
    var j;
    for (var i = 0; i < num; i++) {
        if (dot[i].className === "active dot gamesModule") {
            j = i;
            break;
        }
    }
    if (j === 0)
        return;
    dot[j].setAttribute("class", "dot gamesModule");
    dot[j - 1].setAttribute("class", "active dot gamesModule");
    if (exploreBox.scrollLeft >= 0)
        exploreBox.scrollLeft -= 845;
};
arrowR.onclick = function () {
    var num = dot.length;
    var j;
    for (var i = 0; i < num; i++) {
        if (dot[i].className === "active dot gamesModule") {
            j = i;
            break;
        }
    }
    if (j === (num - 1))
        return;
    dot[j].setAttribute('class', 'dot gamesModule');
    dot[j + 1].setAttribute('class', 'active dot gamesModule');
    if (exploreBox.scrollLeft <= 5760)
        exploreBox.scrollLeft += 845;
};


/*轮播*/
let imgBox = document.querySelectorAll(".cImg");
let theImg = document.querySelectorAll(".topImg");
let cWords = document.querySelectorAll(".cWords");
let item1 = document.querySelectorAll(".item1");
let item2 = document.querySelectorAll(".item2");
let imgNumber = imgBox.length;
/*11*/
let containerImg = document.querySelectorAll(".containerImg");
let underline = document.querySelectorAll(".underline");
let container = document.querySelectorAll(".container");
let logoBox = document.querySelector(".logoBox");

function nextImg() {
    var j;
    for (var i = 0; i < imgNumber; i++) {
        if (imgBox[i].className === "cImg in") {
            j = i;
        }
        /*获取当前图片*/
    }
    var next = (j + 1) % imgNumber;
    imgBox[j].classList.remove("in");
    imgBox[j].classList.add("out");
    imgBox[next].classList.remove("out");
    imgBox[next].classList.add("in");
    theImg[j].classList.remove("in");
    theImg[j].classList.add("out");
    theImg[next].classList.remove("out");
    theImg[next].classList.add("in");
    cWords[j].classList.remove("in");
    cWords[j].classList.add("out");
    cWords[next].classList.remove("out");
    cWords[next].classList.add("in");
    item1[j].classList.remove("active");
    item1[next].classList.add("active");
    item2[j].classList.remove("active");
    item2[next].classList.add("active");
    for (i = 0; i < containerImg.length - 1; i++) {
        containerImg[i].classList.add("transitioning");
        underline[i].classList.add("transitioning");
    }
    var tempImgClass = containerImg[containerImg.length - 1].className;
    var tempUnderlineClass = underline[underline.length - 1].className;
    var tempImgUrl = containerImg[0].src;
    var tempSpanStyle = underline[0].style.backgroundColor;
    for (i = containerImg.length - 1; i >= 1; i--) {
        containerImg[i].className = containerImg[i - 1].className;
        underline[i].className = underline[i - 1].className;
    }
    containerImg[0].className = tempImgClass;
    underline[0].className = tempUnderlineClass;
    tempImgClass = containerImg[0].className;
    tempUnderlineClass = underline[0].className;

    setTimeout(function () {
        for (i = 0; i < containerImg.length - 1; i++) {
            containerImg[i].classList.remove("transitioning");
            underline[i].classList.remove("transitioning");
        }
        for (i = 0; i < containerImg.length - 1; i++) {
            containerImg[i].className = containerImg[i + 1].className;
            underline[i].className = underline[i + 1].className;
            containerImg[i].src = containerImg[i + 1].src;
            underline[i].style.backgroundColor = underline[i + 1].style.backgroundColor;
        }
        containerImg[containerImg.length - 1].className = tempImgClass;
        underline[containerImg.length - 1].className = tempUnderlineClass;
        containerImg[containerImg.length - 1].src = tempImgUrl;
        underline[containerImg.length - 1].style.backgroundColor = tempSpanStyle;
    }, 250);
}

function previousImg() {
    var j;
    for (var i = 0; i < imgNumber; i++) {
        if (imgBox[i].className === "cImg in") {
            j = i;
        }
        /*获取当前图片*/
    }
    var next;
    if (j === 0) {
        next = j + 10;
    } else {
        next = j - 1;
    }
    imgBox[j].classList.remove("in");
    imgBox[j].classList.add("out");
    imgBox[next].classList.remove("out");
    imgBox[next].classList.add("in");
    theImg[j].classList.remove("in");
    theImg[j].classList.add("out");
    theImg[next].classList.remove("out");
    theImg[next].classList.add("in");
    cWords[j].classList.remove("in");
    cWords[j].classList.add("out");
    cWords[next].classList.remove("out");
    cWords[next].classList.add("in");
    item1[j].classList.remove("active");
    item1[next].classList.add("active");
    item2[j].classList.remove("active");
    item2[next].classList.add("active");
    for (i = 0; i < containerImg.length - 1; i++) {
        containerImg[i].classList.add("transitioningL");
        underline[i].classList.add("transitioningL");
    }
    var tempImgClass = containerImg[0].className;
    var tempUnderlineClass = underline[0].className;
    var tempImgUrl = containerImg[underline.length - 1].src;
    var tempSpanStyle = underline[underline.length - 1].style.backgroundColor;
    for (i = 0; i < underline.length - 1; i++) {
        containerImg[i].className = containerImg[i + 1].className;
        underline[i].className = underline[i + 1].className;
    }
    containerImg[underline.length - 1].className = tempImgClass;
    underline[underline.length - 1].className = tempUnderlineClass;
    tempImgClass = containerImg[underline.length - 1].className;
    tempUnderlineClass = underline[underline.length - 1].className;

    setTimeout(function () {
        for (i = 0; i < containerImg.length - 1; i++) {
            containerImg[i].classList.remove("transitioningL");
            underline[i].classList.remove("transitioningL");
        }
        for (i = containerImg.length - 1; i >= 1; i--) {
            containerImg[i].className = containerImg[i - 1].className;
            underline[i].className = underline[i - 1].className;
            containerImg[i].src = containerImg[i - 1].src;
            underline[i].style.backgroundColor = underline[i - 1].style.backgroundColor;
        }
        containerImg[0].className = tempImgClass;
        underline[0].className = tempUnderlineClass;
        containerImg[0].src = tempImgUrl;
        underline[0].style.backgroundColor = tempSpanStyle;
    }, 250);
}

setInterval(function () {
    if (hadClick === 1) {
        hadClick = 0;
        return;
    }
    nextImg();
}, 7000);
let rightArrow = document.querySelector(".rightArrow");
let leftArrow = document.querySelector(".leftArrow");
rightArrow.onclick = function () {
    nextImg();
    hadClick = 1;
};
leftArrow.onclick = function () {
    previousImg();
    hadClick = 1;
};

let previous = document.querySelector(".previous");
let next = document.querySelector(".next");
let next2 = next.parentNode.nextSibling.firstChild;
let previous2 = previous.parentNode.previousSibling.firstChild;
previous.onclick = function () {
    previousImg();
    hadClick = 1;
};
next.onclick = function () {
    nextImg();
    hadClick = 1;
};

let section = document.querySelectorAll("section");
var dis = [];
window.onscroll = function () {
    const clientHeight = window.innerHeight;
    for (var b = 0; b < section.length; b++) {
        dis[b] = section[b].getBoundingClientRect().top;
        if (dis[b] <= clientHeight) {
            section[b].classList.add("visible");
        }
    }
};





















