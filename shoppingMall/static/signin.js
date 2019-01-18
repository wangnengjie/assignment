let subBtn=document.querySelector('#sign-in');
const emailReg=/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
const pwdReg=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
const userReg=/^[a-zA-Z0-9_-]{4,16}$/;
subBtn.addEventListener('click',subListen);
function subListen() {
    let msg={};
    msg.user=document.querySelector('#user').value;
    msg.email=document.querySelector('#email').value;
    msg.pwd=document.querySelector('#password').value;
    if(!emailReg.test(msg.email)){
        alert('邮箱格式错误');
        return;
    }else if(!pwdReg.test(msg.pwd)){
        alert('密码格式错误');
        return;
    }else if(!userReg.test(msg.user)){
        alert('用户名格式错误');
        return;
    }
    if(document.querySelector('#purchaser').checked){
        msg.privilege=1;
    }else{
        msg.privilege=2;
    }
    msg.pwd=hex_md5(msg.pwd+"shop").toUpperCase();
    sentMsg(msg);
}

function sentMsg(msg){
    let xhr=new XMLHttpRequest;
    xhr.open("post","/api/signToDb",false);
    xhr.send(JSON.stringify(msg));
    if(xhr.responseText==="用户名已存在"||xhr.responseText==="邮箱已被注册"){
        alert(xhr.responseText);
    } else{
        window.location.href=xhr.responseURL;
    }
}
