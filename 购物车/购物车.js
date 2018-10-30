var ol=document.querySelector("ol");
/*全选*/
var selectAll=document.querySelector(".selectAll");
selectAll.onclick=function () {
    var check=document.querySelectorAll("#test");
    for(var i=0;i<check.length;i++) {
            check[i].checked=true;
    }
}

/*反选*/
var invert=document.querySelector(".invert");
invert.onclick=function () {
    var check=document.querySelectorAll("#test");
    for(var i=0;i<check.length;i++) {
        if (check[i].checked==true){
            check[i].checked=false;
        } else{
            check[i].checked=true;
        }
    }
}

/*单选删除*/
function remove(node) {
    node.parentNode.parentNode.removeChild(node.parentNode);
}

/*删除已选*/
var dS=document.querySelector(".deleteSelected");
dS.onclick=function () {
    var check=document.querySelectorAll("#test");
    const num=check.length;
    for(var i=0;i<num;i++){
        if(check[i].checked==true){
            remove(check[i]);
        }
    }
}

/*+ -按钮*/
function plus(item) {
    var amount=item.previousElementSibling;
    amount.value=parseInt(amount.value)+1;
}
function minus(item) {
    var amount=item.nextElementSibling;
    if(parseInt(amount.value)>1){
        amount.value=parseInt(amount.value)-1;
    }else {
        remove(item);
    }
}

/*添加商品*/
var addOne=document.querySelector(".addOne");
var newItem=addOne.previousElementSibling;
addOne.onclick= function () {
    var itemName=document.querySelectorAll('span');
    var number=itemName.length;
    if(newItem.value==="")
        return;
    for(var i=0;i<number;i++){
        if(newItem.value==itemName[i].innerText){
            plus(itemName[i].nextElementSibling.nextElementSibling.nextElementSibling);
            return;
        }
    }
    var li=document.createElement('li');
    var input1=document.createElement('input');
    var span=document.createElement('span');
    var btn1=document.createElement('button');
    var input2=document.createElement('input');
    var btn2=document.createElement('button');
    var btn3=document.createElement('button');
    ol.appendChild(li);
    li.appendChild(input1);
    li.appendChild(span);
    li.appendChild(btn1);
    li.appendChild(input2);
    li.appendChild(btn2);
    li.appendChild(btn3);
    input1.setAttribute("type","checkbox");
    input1.setAttribute("name","test");
    input1.setAttribute("id","test");
    span.innerText=newItem.value;
    btn1.setAttribute("onclick","minus(this)");
    btn1.innerText="-";
    input2.setAttribute("type","text");
    input2.setAttribute("style","width:50px;");
    input2.setAttribute("value","1");
    btn2.setAttribute("onclick","plus(this)");
    btn2.innerText="+";
    btn3.setAttribute("onclick","remove(this)");
    btn3.innerText="Delete";
    }
