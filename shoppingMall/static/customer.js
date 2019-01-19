const searchBtn = document.querySelector('#search');
const cartBtn = document.querySelector('#cart');
const orderBtn = document.querySelector('#order');
const searchBox = document.querySelector('.search');
const mainDiv = document.querySelector('#main');
searchBtn.addEventListener('click', getGoods);
cartBtn.addEventListener('click', getCart);
orderBtn.addEventListener('click',getOrder);
/**
 * 获取商品
 */
function getGoods(event, page = 1, keyword = searchBox.value) {
    if (keyword === '')
        return;
    fetch(`/customer/goods/${page}`, {
        body: keyword,
        method: 'POST',
        credentials: 'include',
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.text();
        }
    }).then(response => {
        if (typeof response === "string") {
            alert(response);
        } else {
            mainDiv.innerHTML = '';
            let amount = response.amount;
            let k = (amount > 10) ? 10 : amount;
            for (let i = 0; i < k; i++) {
                showGood(response.list[i]);
            }
            if (page > 1) {
                mainDiv.innerHTML += `<button onclick="getGoods(null,${page - 1},'${keyword}')">上一页</button>`;
            }
            if (amount > 10) {
                mainDiv.innerHTML += `<button onclick="getGoods(null,${page + 1},'${keyword}')">下一页</button>`;
            }
        }
    })
}

// TODO:聊天室链接
function showGood(obj) {
    let keyword = obj.keyword;
    keyword = keyword.join(' ');
    mainDiv.innerHTML += `<div class="good">
    <br>
    <p>商品名：${obj.name}</p>
    <p>卖家：${obj.seller}</p>
    <p>价格：￥${(obj.price) / 100}</p>
    <p>库存：${obj.amount}</p>
    <p>关键词：${keyword}</p>
    <button onclick="addToCart('${obj['_id']}')">添加到购物车</button>
    <button>联系卖家</button>  
    <br><br>
</div>`
}

function addToCart(id) {
    let msg = {
        type: 0,
        id: [id]
    };
    fetch('/customer/carts', {
        body: JSON.stringify(msg),
        method: 'POST',
        credentials: 'include'
    }).then(response => {
        return response.text()
    }).then(data => {
        alert(data);
        if (data !== 'OK') {
            window.location.href = '/'
        }
    })
}

/**
 * 获取购物车
 */
function getCart() {
    fetch('/customer/carts', {
        method: 'GET',
        credentials: 'include',
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
        return response.text()
    }).then(response => {
        if (response.amount === 0) {
            mainDiv.innerHTML = `<h1>您的购物车是空的诶……</h1>`
        } else {
            showCart(response);
        }
    })
}

function showCart(obj) {
    mainDiv.innerHTML = ``;
    obj.list.forEach(good => {
        mainDiv.innerHTML += `<div id="${good['_id']}" class="cart">
                <button onclick="minus(this)">-</button>
                <input value=0 onkeyup="this.value=this.value.replace(/\\D/g,'')" class="amount">
                <button onclick="plus(this,${good.amount})">+</button>
                <button onclick="deleteCart('${good['_id']}')">移出购物车</button>
                <p>商品：${good.name}</p>
                <p>卖家：${good.seller}</p>
                <p>单价：￥${(good.price) / 100}</p>
                <p>库存：${good.amount}</p>
            </div>`
    });
    mainDiv.innerHTML += `<br><label>地址<input id="adds" type="text"></label><button onclick="makeOrder()">提交订单</button>`
}

function deleteCart(id) {
    let msg = {
        type: 1,
        id: [id]
    };
    fetch('/customer/carts', {
        body: JSON.stringify(msg),
        method: 'POST',
        credentials: 'include'
    }).then(response => {
        return response.text()
    }).then(data => {
        if (data === 'OK') {
            alert(data);
            mainDiv.removeChild(document.getElementById(id));
        } else {
            alert(data);
        }
    })
}

function minus(item) {
    let pre = item.nextElementSibling.value;
    if (parseInt(pre) <= 0)
        item.nextElementSibling.value = 0;
    else
        item.nextElementSibling.value = parseInt(pre) - 1;
}

function plus(item, max) {
    let pre = item.previousElementSibling.value;
    if (parseInt(pre) >= max)
        item.previousElementSibling.value = max;
    else
        item.previousElementSibling.value = parseInt(pre) + 1;
}

/**
 * 订单相关
 */
function makeOrder() {
    let adds=document.querySelector('#adds').value.replace(' ','');
    if (adds===''){
        return;
    }
    let msg={};
    let nodeOfAmount=document.querySelectorAll('.amount');
    nodeOfAmount.forEach(node=>{
        if (parseInt(node.value)>0){
            let id=node.parentNode.id;
            msg[id]=parseInt(node.value);
        }
    });
    fetch('/customer/orders',{
        body:JSON.stringify({adds:adds,goods:msg}),
        method:'POST',
        credentials:'include',
    }).then(response=>{
        if(response.ok){
            alert('OK');
            for(let k in msg){
                mainDiv.removeChild(document.getElementById(`${k}`))
            }
        }else{
            alert('超额');
            getCart();
        }
    })
}

function getOrder() {
    fetch('/customer/orders',{
        method:'GET',
        credentials:'include',
    }).then(response=>{
        if(response.ok){
            return response.json();
        }
        alert('请重新登录');
        window.location.href='/';
    }).then(data=>{
        if(data.amount===0){
            mainDiv.innerHTML=`<h1>您目前还没有下过单诶</h1>`;
        }else {
            showOrder(data.list);
        }
    })
}

function showOrder(data) {
    mainDiv.innerHTML='';
    data.forEach(order=>{
        mainDiv.innerHTML+=`<div>
                <p>订单号：${order['_id']}</p>
                <p>卖家：${order.seller}</p>
                <p>商品：${order.goodsName}</p>
                <p>数量：${order.amount}</p>
                <p>价格：${(order.price)/100}</p>
                <p>收货地址：${order.adds}</p>
                <p>下单时间：${order.time}</p>
            </div>`
    })
}