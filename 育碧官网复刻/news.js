let btn = document.querySelectorAll(".topOfNews ul li");
let news = document.querySelectorAll(".news");
/*插入函数，尚未实现*/
function delete_tags(str) {
    return str.replace(/<[^>]+>/g, "");
}
function added(obj){
    let i;
    let arr = obj["hits"]["hits"];
    let divLink=document.querySelectorAll(".CardLatestNews");
    let imgLink=document.querySelectorAll(".CardLatestNews__image");
    let divTitle=document.querySelectorAll(".CardLatestNews__Heading");
    let divNews=document.querySelectorAll(".CardLatestNews__Excerpt");
    let date=document.querySelectorAll(".--byline-date");
    for(i=0;i<6;i++)
    {
        let title = arr[i]["_source"].title;
        let thumb = arr[i]["_source"].thumbnail;
        let createdAt = arr[i]["_source"].createdAt;
        let link = arr[i]["_source"].link;
        let content = delete_tags(arr[i]["_source"].content).substr(0, 60);
        let dt = new Date(createdAt);
        createdAt =  "November " + dt.getDay() + "," + dt.getFullYear();
        divLink[i].href=link;
        imgLink[i].src=thumb;
        divTitle[i].innerHTML=title;
        divNews[i].innerHTML=content+"...";
        date[i].innerHTML=createdAt;
    }
}
function loading(){
    var obj;
    var example = {
        "languages": ["en-us"],
        "channels": ["marketing"],
        "types": ["article"],
        "filters": [{"field": "typeSlug", "values": ["news"]}],
        "size": 6,
        "from": 0,
        "sorts": [{"field": "createdAt", "direction": "desc"}],
        "appId": "f35adcb5-1911-440c-b1c9-48fdc1701c68"
    };
    var data = JSON.stringify(example);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://search.ubisoft.com/api/v2/search", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    //发送数据
    xhr.send(data);
    //绑定onreadystatechange事件
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
            obj = xhr.responseText;
            obj = JSON.parse(obj);
            added(obj);
            console.log(obj);
        }
    };

    /*获取的数据已经存在了obj内，插入html暂时没写*/
    /*插入html*/
}
loading();
btn[0].onclick = function () {
    for (var j = 0; j < btn.length; j++) {
        if (btn[j].className === "liSelected") {
            btn[j].classList.remove("liSelected");
            break;
        }
    }
    btn[0].setAttribute("class", "liSelected");
    var obj;
    var example = {
        "languages": ["en-us"],
        "channels": ["marketing"],
        "types": ["article"],
        "filters": [{"field": "typeSlug", "values": ["news"]}],
        "size": 6,
        "from": 0,
        "sorts": [{"field": "createdAt", "direction": "desc"}],
        "appId": "f35adcb5-1911-440c-b1c9-48fdc1701c68"
    };
    var data = JSON.stringify(example);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://search.ubisoft.com/api/v2/search", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    //发送数据
    xhr.send(data);
    //绑定onreadystatechange事件
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
            obj = xhr.responseText;
            obj = JSON.parse(obj); added(obj);
        }
    };
    /*获取的数据已经存在了obj内，插入html暂时没写*/
   /*插入html*/
};
btn[1].onclick = function () {
    for (var j = 0; j < btn.length; j++) {
        if (btn[j].className === "liSelected") {
            btn[j].classList.remove("liSelected");
            break;
        }
    }
    btn[1].setAttribute("class", "liSelected");
    var obj;
    var example = {
        "languages": ["en-us"],
        "channels": ["marketing"],
        "types": ["article"],
        "filters": [{"field": "typeSlug", "values": ["news"]}],
        "size": 6,
        "from": 0,
        "sorts": [{"field": "createdAt", "direction": "desc"}],
        "keyword": "assassins-creed-odyssey",
        "fields": ["categorySlug"],
        "appId": "f35adcb5-1911-440c-b1c9-48fdc1701c68"
    };
    var data = JSON.stringify(example);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://search.ubisoft.com/api/v2/search", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    //发送数据
    xhr.send(data);
    //绑定onreadystatechange事件
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
            obj = xhr.responseText;
            obj = JSON.parse(obj);
            added(obj);
        }
    };
    /*获取的数据已经存在了obj内，插入html暂时没写*/


};
btn[2].onclick = function () {
    for (var j = 0; j < btn.length; j++) {
        if (btn[j].className === "liSelected") {
            btn[j].classList.remove("liSelected");
            break;
        }
    }
    btn[2].setAttribute("class", "liSelected");
    var obj;
    var example = {
        "languages": ["en-us"],
        "channels": ["marketing"],
        "types": ["article"],
        "filters": [{"field": "typeSlug", "values": ["news"]}],
        "size": 6,
        "from": 0,
        "sorts": [{"field": "createdAt", "direction": "desc"}],
        "keyword": "for-honor",
        "fields": ["categorySlug"],
        "appId": "f35adcb5-1911-440c-b1c9-48fdc1701c68"
    };
    var data = JSON.stringify(example);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://search.ubisoft.com/api/v2/search", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    //发送数据
    xhr.send(data);
    //绑定onreadystatechange事件
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
            obj = xhr.responseText;
            obj = JSON.parse(obj);
            added(obj);
        }
    };
    /*获取的数据已经存在了obj内，插入html暂时没写*/


};
btn[3].onclick = function () {
    for (var j = 0; j < btn.length; j++) {
        if (btn[j].className === "liSelected") {
            btn[j].classList.remove("liSelected");
            break;
        }
    }
    btn[3].setAttribute("class", "liSelected");
    var obj;
    var example = {
        "languages": ["en-us"],
        "channels": ["marketing"],
        "types": ["article"],
        "filters": [{"field": "typeSlug", "values": ["news"]}],
        "size": 6,
        "from": 0,
        "sorts": [{"field": "createdAt", "direction": "desc"}],
        "keyword": "the-division-2",
        "fields": ["categorySlug"],
        "appId": "f35adcb5-1911-440c-b1c9-48fdc1701c68"
    };
    var data = JSON.stringify(example);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://search.ubisoft.com/api/v2/search", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    //发送数据
    xhr.send(data);
    //绑定onreadystatechange事件
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
            obj = xhr.responseText;
            obj = JSON.parse(obj);
            added(obj);
        }
    };
    /*获取的数据已经存在了obj内，插入html暂时没写*/


};
btn[4].onclick = function () {
    for (var j = 0; j < btn.length; j++) {
        if (btn[j].className === "liSelected") {
            btn[j].classList.remove("liSelected");
            break;
        }
    }
    btn[4].setAttribute("class", "liSelected");
    var obj;
    var example = {
        "languages": ["en-us"],
        "channels": ["marketing"],
        "types": ["article"],
        "filters": [{"field": "typeSlug", "values": ["news"]}],
        "size": 6,
        "from": 0,
        "sorts": [{"field": "createdAt", "direction": "desc"}],
        "keyword": "rainbow-six-siege",
        "fields": ["categorySlug"],
        "appId": "f35adcb5-1911-440c-b1c9-48fdc1701c68"
    };
    var data = JSON.stringify(example);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://search.ubisoft.com/api/v2/search", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    //发送数据
    xhr.send(data);
    //绑定onreadystatechange事件
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
            obj = xhr.responseText;
            obj = JSON.parse(obj);
            added(obj);
        }
    };
    /*获取的数据已经存在了obj内，插入html暂时没写*/


};