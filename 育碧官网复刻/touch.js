let fingerSlide = document.querySelectorAll(".fingerSlide");
let box = document.querySelectorAll(".finger");
let touchBody = document.querySelectorAll(".touchBody");
let startX = 0.0;
let moveX = 0.0;
let distanceX = 0.0;
let pre = 0;
let down = 0;
let realDistance = 30;
let abc=1;
/*
function setLeft(i) {
    if (i >= 0 && i <= 40) {
        fingerSlide[0].style.left = "0%";
        fingerSlide[1].style.left = "40%";
        fingerSlide[2].style.left = "80%";
        fingerSlide[3].style.left = "120%";
        fingerSlide[4].style.left = "-40%";
    } else if (i < 0 && i > -100) {
        fingerSlide[0].style.left = "0%";
        fingerSlide[1].style.left = "40%";
        fingerSlide[2].style.left = "80%";
        fingerSlide[3].style.left = "120%";
        fingerSlide[4].style.left = "160%";
    } else if (i <= -100 && i > -140) {
        fingerSlide[0].style.left = "200%";
        fingerSlide[1].style.left = "40%";
        fingerSlide[2].style.left = "80%";
        fingerSlide[3].style.left = "120%";
        fingerSlide[4].style.left = "160%";
    } else if (i <= -140 && i >= -150) {
        fingerSlide[0].style.left = "200%";
        fingerSlide[1].style.left = "240%";
        fingerSlide[2].style.left = "80%";
        fingerSlide[3].style.left = "120%";
        fingerSlide[4].style.left = "160%";
    } else if (i <= 50 && i > 40) {
        fingerSlide[0].style.left = "0%";
        fingerSlide[1].style.left = "40%";
        fingerSlide[2].style.left = "80%";
        fingerSlide[3].style.left = "-80%";
        fingerSlide[4].style.left = "-40%";
    }
}

var setTranslateX = function (translateX) {
    translateX += pre;
    if (translateX < -150.0) {
        translateX += 200.0;
    } else if (translateX > 50.0) {
        translateX -= 200.0;
    }

};

function translate(translateX) {
    box[0].style.transform = "translate3d(" + translateX + "%,0px,0px)";
}

function mouseisdown(event) {
    down = 1;
    event.preventDefault();
    pre = Number(box[0].style.transform.replace(/[^0-9]/ig, ""));
    if (pre !== 30) {
        pre = -pre;
    }
    startX = event.clientX;//记录起始X
    moveX = event.clientX;
    distanceX = 0.0;
}

function mouseismove(event) {
    if (!down) {
        return false;
    }
    event.preventDefault();
    var max = document.body.clientWidth;
    moveX = event.clientX;
    distanceX = ((moveX - startX) / max) * 100;
    setTranslateX(distanceX);
}

function mouseisup(event) {
    if (!down)
        return false;
    down = 0;
    event.preventDefault();
    if (Math.abs(distanceX) > 20) {
        var isSelected;
        for (var count = 0; count < fingerSlide.length; count++) {
            if (fingerSlide[count].className === "fingerSlide middleImg") {
                isSelected = count;
                fingerSlide[count].classList.remove("middleImg");
                break;
            }
        }
        if (distanceX < 0) {
            isSelected = (count + 1) % 5;
            var nextoneR = pre - 40;
            if (pre - 40 < -150) {
                translate(30);
                setTimeout(function () {
                    box[0].style.transform = "translateX(" + 30 + "%)";
                    setLeft(30);
                }, 200);
            } else {
                translate(nextoneR);
                setTimeout(function () {
                    box[0].style.transform = "translateX(" + nextoneR + "%)";
                    setLeft(nextoneR);
                }, 200);
            }
        } else if (distanceX > 0) {
            isSelected = (count + 4) % 5;
            var nextoneL = pre + 40;
            var a = -130;
            if (pre + 40 > 50) {
                box[0].style.transform = "translateX(" + a + "%)";
            } else {
                box[0].style.transform = "translateX(" + nextoneL + "%)";
            }
        }
        fingerSlide[isSelected].classList.add("middleImg");
    } else {
        box[0].style.transform = "translateX(" + pre + "%)";
        setLeft(pre);
    }

}

touchBody[0].addEventListener('mousedown', mouseisdown);
touchBody[0].addEventListener("mousemove", mouseismove);
touchBody[0].addEventListener('mouseup', mouseisup);


function setLeft2(i) {
    if (i >= 0 && i <= 40) {
        fingerSlide[5].style.left = "0%";
        fingerSlide[6].style.left = "40%";
        fingerSlide[7].style.left = "80%";
        fingerSlide[8].style.left = "120%";
        fingerSlide[9].style.left = "-40%";
    } else if (i < 0 && i > -100) {
        fingerSlide[5].style.left = "0%";
        fingerSlide[6].style.left = "40%";
        fingerSlide[7].style.left = "80%";
        fingerSlide[8].style.left = "120%";
        fingerSlide[9].style.left = "160%";
    } else if (i <= -100 && i > -140) {
        fingerSlide[5].style.left = "200%";
        fingerSlide[6].style.left = "40%";
        fingerSlide[7].style.left = "80%";
        fingerSlide[8].style.left = "120%";
        fingerSlide[9].style.left = "160%";
    } else if (i <= -140 && i >= -150) {
        fingerSlide[5].style.left = "200%";
        fingerSlide[6].style.left = "240%";
        fingerSlide[7].style.left = "80%";
        fingerSlide[8].style.left = "120%";
        fingerSlide[9].style.left = "160%";
    } else if (i <= 50 && i > 40) {
        fingerSlide[5].style.left = "0%";
        fingerSlide[6].style.left = "40%";
        fingerSlide[7].style.left = "80%";
        fingerSlide[8].style.left = "-80%";
        fingerSlide[9].style.left = "-40%";
    }
}

var setTranslateX2 = function (translateX) {
    var now = box[1].style.transform.replace(/[^0-9]/ig, "");
    if (now === "30") {
        now = Number(now);
    } else {
        now = -Number(now);
    }
    translateX += now;
    if (translateX < -150) {
        translateX += 200;
    } else if (translateX > 50) {
        translateX -= 200;
    }
    box[1].style.transform = "translateX(" + translateX + "%)";
    setLeft2(translateX);
};
touchBody[1].addEventListener('mousedown', function (e) {
    e.preventDefault();
    pre = Number(box[1].style.transform.replace(/[^0-9]/ig, ""));
    if (pre !== 30) {
        pre = -pre;
    }
    startX = e.clientX;  //记录起始X
    touchBody[1].addEventListener('mousemove', analyze2);
});

var analyze2 = function (e) {
    e.preventDefault();
    var max = document.body.clientWidth;
    moveX = e.clientX;   //滑动时候的X
    distanceX = moveX - startX; //计算移动的距离
    setTranslateX2(distanceX);  //实时的定位
};


touchBody[1].addEventListener('mouseup', function (e) {
    e.preventDefault();
    touchBody[1].removeEventListener("mousemove", analyze2);
    if (Math.abs(distanceX) > 20) {
        var isSelected;
        for (var count = 5; count < fingerSlide.length; count++) {
            if (fingerSlide[count].className === "fingerSlide middleImg") {
                isSelected = count;
                fingerSlide[count].classList.remove("middleImg");
                break;
            }
        }
        if (distanceX < 0) {
            isSelected = (count + 1) % 5 + 5;
            var nextoneR = pre - 40;
            if (pre - 40 < -150) {
                box[1].style.transform = "translateX(" + 30 + "%)";
            } else {
                box[1].style.transform = "translateX(" + nextoneR + "%)";
            }
        } else if (distanceX > 0) {
            isSelected = (count + 4) % 5 + 5;
            var nextoneL = pre + 40;
            var a = -130;
            if (pre + 40 > 50) {
                box[1].style.transform = "translateX(" + a + "%)";
            } else {
                box[1].style.transform = "translateX(" + nextoneL + "%)";
            }
        }
        fingerSlide[isSelected].classList.add("middleImg");
    } else {
        box[1].style.transform = "translateX(" + pre + "%)";
    }
    pre = Number(box[1].style.transform.replace(/[^0-9]/ig, ""));
    if (pre !== 30) {
        pre = -pre;
    }
    setLeft2(pre);
    //重置参数
    startX = 0.0;
    moveX = 0.0;
    distanceX = 0.0;
});
*/


function setLeft(i) {
    if (i >= 0 && i <= 40) {
        fingerSlide[0].style.left = "0%";
        fingerSlide[1].style.left = "40%";
        fingerSlide[2].style.left = "80%";
        fingerSlide[3].style.left = "120%";
        fingerSlide[4].style.left = "-40%";
    } else if (i < 0 && i > -100) {
        fingerSlide[0].style.left = "0%";
        fingerSlide[1].style.left = "40%";
        fingerSlide[2].style.left = "80%";
        fingerSlide[3].style.left = "120%";
        fingerSlide[4].style.left = "160%";
    } else if (i <= -100 && i > -140) {
        fingerSlide[0].style.left = "200%";
        fingerSlide[1].style.left = "40%";
        fingerSlide[2].style.left = "80%";
        fingerSlide[3].style.left = "120%";
        fingerSlide[4].style.left = "160%";
    } else if (i <= -140 && i >= -150) {
        fingerSlide[0].style.left = "200%";
        fingerSlide[1].style.left = "240%";
        fingerSlide[2].style.left = "80%";
        fingerSlide[3].style.left = "120%";
        fingerSlide[4].style.left = "160%";
    } else if (i <= 50 && i > 40) {
        fingerSlide[0].style.left = "0%";
        fingerSlide[1].style.left = "40%";
        fingerSlide[2].style.left = "80%";
        fingerSlide[3].style.left = "-80%";
        fingerSlide[4].style.left = "-40%";
    }
}

function mouseisdown(event) {
    event.preventDefault();
    if(abc===0)
        return false;
    box[0].classList.remove("fingerTranslation");
    startX = 0.0;
    moveX = 0.0;
    distanceX = 0.0;
    startX = event.clientX;
    moveX = event.clientX;
    pre = Number(box[0].style.transform.replace(/[^0-9]/ig, ""));
    if(pre>1000)
        pre/=1000000;
    if (pre !== 30) {
        pre = -pre;
    }
    box[0].style.transform = "translate3d(" + pre + "%,0px,0px)";
    /*记录点击时的位移；*/
    for (var count = 0; count < fingerSlide.length; count++) {
        if (fingerSlide[count].className === "fingerSlide middleImg") {
            fingerSlide[count].classList.remove("middleImg");
            break;
        }
    }
    down = 1;
}

function mouseismove(event) {
    event.preventDefault();
    if (!down)
        return false;
    let max = document.body.clientWidth;
    moveX = event.clientX;
    distanceX = ((moveX - startX) / max) * 100;
    realDistance = pre + distanceX;
    if (realDistance < -150) {
        realDistance += 200;
    } else if (realDistance > 50) {
        realDistance -= 200;
    }
    setLeft(realDistance);
    box[0].style.transform = "translate3d(" + realDistance + "%,0px,0px)";

}

function mouseisup(event) {
    event.preventDefault();
    if (!down)
        return false;
    down = 0;
    abc=0;
    box[0].classList.add("fingerTranslation");
    let arr = [];
    arr[0] = 200;
    for (var key = -130; key <= 30; key += 40) {
        if (Math.abs(realDistance - key) < arr[0]) {
            arr[0] = Math.abs(realDistance - key);
            arr[1] = key;
        }
    }
    if(arr[1]===30){
        fingerSlide[0].classList.add("middleImg");
    }else if(arr[1]===-10){
        fingerSlide[1].classList.add("middleImg");
    }else if(arr[1]===-50){
        fingerSlide[2].classList.add("middleImg");
    }else if(arr[1]===-90){
        fingerSlide[3].classList.add("middleImg");
    }else if(arr[1]===-130){
        fingerSlide[4].classList.add("middleImg");
    }
    box[0].style.transform = "translate3d(" + arr[1] + "%,0px,0px)";
    box[0].addEventListener("transitionend",function () {
        box[0].style.transform = "translateX(" + arr[1] + "%)";
        abc=1;
    });
    box[0].addEventListener("webkitTransitionEnd",function () {
        box[0].style.transform = "translateX(" + arr[1] + "%)";
        abc=1;
    });
    setLeft(arr[1]);
}
function touchisdown(event) {
    event.preventDefault();
    if(abc===0)
        return false;
    box[0].classList.remove("fingerTranslation");
    startX = 0.0;
    moveX = 0.0;
    distanceX = 0.0;
    startX = event.touches[0].clientX;
    moveX = event.touches[0].clientX;
    pre = Number(box[0].style.transform.replace(/[^0-9]/ig, ""));
    if(pre>1000)
        pre/=1000000;
    if (pre !== 30) {
        pre = -pre;
    }
    box[0].style.transform = "translate3d(" + pre + "%,0px,0px)";
    /*记录点击时的位移；*/
    for (var count = 0; count < fingerSlide.length; count++) {
        if (fingerSlide[count].className === "fingerSlide middleImg") {
            fingerSlide[count].classList.remove("middleImg");
            break;
        }
    }
    down = 1;
}
function touchismove(event) {
    event.preventDefault();
    if (!down)
        return false;
    let max = document.body.clientWidth;
    moveX = event.touches[0].clientX;
    distanceX = ((moveX - startX) / max) * 100;
    realDistance = pre + distanceX;
    if (realDistance < -150) {
        realDistance += 200;
    } else if (realDistance > 50) {
        realDistance -= 200;
    }
    setLeft(realDistance);
    box[0].style.transform = "translate3d(" + realDistance + "%,0px,0px)";
}




touchBody[0].addEventListener("mousedown", mouseisdown, false);
touchBody[0].addEventListener("mousemove", mouseismove, false);
touchBody[0].addEventListener("mouseup", mouseisup, false);
touchBody[0].addEventListener("touchstart",touchisdown,false);
touchBody[0].addEventListener("touchmove",touchismove,false);
touchBody[0].addEventListener("touchend",mouseisup,false);




















