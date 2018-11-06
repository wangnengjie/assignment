/*搜索栏*/
let searchButton=document.querySelector(".searchButton");
let searchBtn=document.querySelector("#searchBtn");
let search=document.querySelector(".search");
let icon=document.querySelector(".icon");
searchButton.addEventListener('click',function () {
    if(searchBtn.getAttribute('class')==='searchTextHid'){
        searchBtn.setAttribute('class','searchText');
        search.style.backgroundColor="white";
        icon.src="img/blacksearch.png"
    }else{
        searchBtn.setAttribute('class','searchTextHid');
        search.style.backgroundColor="black";
        icon.src="img/search.png"
    }
});
/*箭头*/
var dot=document.querySelectorAll(".dot");
var arrowL=document.querySelector(".arrowsL");
var arrowR=document.querySelector(".arrowsR");
var exploreBox=document.querySelector("#exploreBox");
arrowL.onclick=function () {
    var num=dot.length;
    var j;
    for(var i=0;i<num;i++){
        if(dot[i].className==="active dot gamesModule"){
            j=i;
            break;
        }
    }
    if(j===0)
        return;
    dot[j].setAttribute("class","dot gamesModule");
    dot[j-1].setAttribute("class","active dot gamesModule");
    if(exploreBox.scrollLeft>=0)
        exploreBox.scrollLeft-=1460;
};
arrowR.onclick=function () {
    var num=dot.length;
    var j;
    for(var i=0;i<num;i++){
        if(dot[i].className==="active dot gamesModule"){
            j=i;
            break;
        }
    }
    if(j===(num-1))
        return;
    dot[j].setAttribute('class','dot gamesModule');
    dot[j+1].setAttribute('class','active dot gamesModule');
    if(exploreBox.scrollLeft<=21888)
        exploreBox.scrollLeft+=1460;
};