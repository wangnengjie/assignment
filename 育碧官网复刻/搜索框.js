var searchButton=document.querySelector(".searchButton");
var searchBtn=document.querySelector("#searchBtn");
searchButton.addEventListener('click',function () {
    if(searchBtn.getAttribute('class')==='searchTextHid'){
        searchBtn.setAttribute('class','searchText');
    }else{
        searchBtn.setAttribute('class','searchTextHid');
    }
});