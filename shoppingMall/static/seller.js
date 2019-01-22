const addBtn = document.querySelector('#check');
const orderBtn = document.querySelector('#order');
const goodsBtn = document.querySelector('#goods');
const mainDiv = document.querySelector('#main');
addBtn.addEventListener('click', addGoods);
orderBtn.addEventListener('click', getOrder);
goodsBtn.addEventListener('click', getGoods);
let goods;

/**
 * 上架相关
 */
function addGoods() {
    mainDiv.innerHTML = `<div class="add"><label>商品名<input type="text" id="name"></label><br>
                       <label>上架数量<input type="text" onkeyup="this.value=this.value.replace(/\\D/g,'')" id="amount"></label><br>
                       <label>单价<input type="text" onkeyup="clearNoNum(this)" id="price"></label><br>
                       <label>关键词<input type="text" id="keyword"><span>（请使用空格隔开）</span></label><br>
                       <button onclick="subGoods()">提交</button></div>`
}

function clearNoNum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字而不是
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
}

function subGoods() {
    let name = document.querySelector('#name').value;
    let amount = document.querySelector('#amount').value;
    let price = document.querySelector('#price').value;
    let keyword = document.querySelector('#keyword').value.split(' ');
    if (name === '' || isNaN(parseInt(amount)) || isNaN(Number(price)) || keyword.length === 0) {
        return;
    }
    let msg = {
        name: name,
        amount: parseInt(amount),
        price: parseInt(Number(price) * 100),
        keyword: keyword
    };
    fetch('/seller/goods', {
        body: JSON.stringify(msg),
        method: 'POST',
        credentials: 'include'
    }).then(response => {
        return response.text();
    }).then(data => {
        if (data === '请重新登陆') {
            alert(data);
            window.location.href = '/login';
        } else if (data === 'Bad Request') {
            alert(data);
        } else {
            alert(data);
            mainDiv.innerHTML = '';
        }
    })
}

/**
 * 订单相关
 */
function getOrder() {
    fetch('/seller/orders', {
        method: 'GET',
        credentials: 'include',
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
        alert('请重新登录');
        window.location.href = '/';
    }).then(data => {
        if (data.amount === 0) {
            mainDiv.innerHTML = `<h1>您目前还没有接到过订单诶</h1>`;
        } else {
            showOrder(data.list);
        }
    })
}

function showOrder(data) {
    mainDiv.innerHTML = '';
    data.forEach(order => {
        mainDiv.innerHTML += `<div class="order">
                <p>订单号：${order['_id']}</p>
                <p>货号：${order.goodsId}</p>
                <p>买家：${order.customer}</p>
                <p>商品：${order.goodsName}</p>
                <p>数量：${order.amount}</p>
                <p>总价：￥${(order.price) / 100}</p>
                <p>派送地址：${order.adds}</p>
                <p>下单时间：${order.time}</p>
            </div>`
    })
}

/**
 * 商品相关
 */
function getGoods() {
    fetch('/seller/goods', {
        method: 'GET',
        credentials: 'include',
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('请重新登陆')
    }).then(data => {
        goods = data;
        mainDiv.innerHTML = `<button onclick="showPass()">已上架</button><button onclick="showCheck()">未上架</button>`
    }).catch(err => {
        alert(err.message);
        window.location.href = '/login'
    })
}

function showPass() {
    let list = goods.on;
    mainDiv.innerHTML = `<button onclick="showPass()">已上架</button><button onclick="showCheck()">未上架</button>`
    list.forEach(good => {
        mainDiv.innerHTML += `<div id='${good['_id']}' class="add">
            <button onclick="deleteGoods(1,'${good['_id']}')">下架</button> <button onclick="modifyGoods(1,'${good['_id']}')" class="modify">修改</button>
            <p>货号：${good['_id']}</p>
            <p>商品：${good.name}</p>
            <p>库存：${good.amount}</p>
            <p>单价：￥${good.price / 100}</p>
            <p>关键词：${good.keyword.join(' ')}</p>
            <div class="M${good['_id']}"></div>
        </div>`
    })
}

function showCheck() {
    let list = goods.check;
    mainDiv.innerHTML = `<button onclick="showPass()">已上架</button><button onclick="showCheck()">未上架</button>`
    list.forEach(good => {
        mainDiv.innerHTML += `<div id='${good['_id']}' class="add">
            <button onclick="deleteGoods(2,'${good['_id']}')">下架</button> <button onclick="modifyGoods(2,'${good['_id']}')" class="modify">修改</button>
            <p>审核号：${good['_id']}</p>
            <p>状态：${(good.status===0)?'待审核':'未通过'}</p>
            <p>商品：${good.name}</p>
            <p>库存：${good.amount}</p>
            <p>单价：￥${good.price / 100}</p>
            <p>关键词：${good.keyword.join(' ')}</p>
            <div class="M${good['_id']}"></div>
        </div>`
    })
}

function deleteGoods(method, id) {
    let msg = {
        type: method,
        _id: id,
    };
    fetch('/seller/goods', {
        body: JSON.stringify(msg),
        method: 'DELETE',
        credentials: 'include'
    }).then(response => {
        if (response.ok) {
            return response.text();
        }
        alert('Bad Request');
    }).then(data => {
        alert(data);
        mainDiv.removeChild(document.getElementById(id))
    })
}

function modifyGoods(method, id) {
    let nodes = document.querySelectorAll('.modify');
    nodes.forEach(node => {
        node.disabled = true;
    });
    let node = document.querySelector(`.M${id}`);
    node.innerHTML = `<label>商品<input type="text" id="name"></label><br>
                     <label>库存<input type="text" onkeyup="this.value=this.value.replace(/\\D/g,'')" id="amount"></label><br>
                     <label>单价<input type="text" onkeyup="clearNoNum(this)" id="price"></label><br>
                     <label>关键词<input type="text" id="keyword"><span>（请使用空格隔开）</span></label><br>
                     <button onclick="modify(${method},'${id}')">提交</button><button onclick="cancel(this)">取消</button>`
}

function cancel(obj) {
    obj.parentNode.innerHTML='';
    let nodes = document.querySelectorAll('.modify');
    nodes.forEach(node => {
        node.disabled = false;
    });
}

function modify(method, id) {
    let name = document.querySelector('#name').value;
    let amount = document.querySelector('#amount').value;
    let price = document.querySelector('#price').value;
    let keyword = document.querySelector('#keyword').value.split(' ');
    if (name === '' || isNaN(parseInt(amount)) || isNaN(Number(price)) || keyword.length === 0) {
        return;
    }
    let msg = {
        type: method,
        _id: id,
        name: name,
        amount: parseInt(amount),
        price: parseInt(Number(price) * 100),
        keyword: keyword
    };
    fetch('/seller/goods', {
        body: JSON.stringify(msg),
        method: 'PUT',
        credentials: 'include'
    }).then(response => {
        return response.text();
    }).then(data => {
        let nodes = document.querySelectorAll('.modify');
        nodes.forEach(node => {
            node.disabled = false;
        });
        if (data === '请重新登陆') {
            alert(data);
            window.location.href = '/login';
        } else if (data === 'Bad Request') {
            alert(data);
        } else {
            alert(data);
            mainDiv.removeChild(document.getElementById(id))
        }
    })
}