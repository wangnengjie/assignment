window.onload = function () {
    let btn = document.querySelectorAll(".topOfNews ul li");
    let news = document.querySelectorAll(".news");
    btn[0].onclick = function () {
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
                var obj;
                obj = xhr.responseText;
                obj = JSON.parse(obj);
            }
        }
    }
};