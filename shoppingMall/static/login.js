let subBtn=document.querySelector('#log-in');
const emailReg=/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
const pwdReg=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
const userReg=/^[a-zA-Z0-9_-]{4,16}$/;
subBtn.addEventListener('click',subListen);
function subListen() {
    let msg={};
    msg.user=document.querySelector('#user').value;
    msg.pwd=document.querySelector('#password').value;
    if(userReg.test(msg.user)){
        msg.type=0;
    }else if(emailReg.test(msg.user)){
        msg.type=1
    }else{
        alert('账号格式错误');
        return;
    }
    if(!pwdReg.test(msg.pwd)){
        alert('密码格式错误');
        return;
    }
    msg.pwd=hex_md5(msg.pwd+"shop").toUpperCase();
    sentMsg(msg)
}
function sentMsg(msg){
    let xhr=new XMLHttpRequest;
    xhr.open("post","logToMall",false);
    xhr.send(JSON.stringify(msg));
    console.log(xhr);
    if(xhr.responseText==="账号或密码错误"){
        alert(xhr.responseText);
    } else{
        window.location.href=xhr.responseURL;
    }
}