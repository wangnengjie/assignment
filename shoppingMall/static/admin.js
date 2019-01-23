const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
const pwdReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
const userReg = /^[a-zA-Z0-9_-]{4,16}$/;
const userBtn = document.querySelector('#user');
const checkBtn = document.querySelector('#check');
const goodsBtn = document.querySelector('#goods');
const mainDiv = document.querySelector('#main');
const addBtn = document.querySelector('#addUser');
const searchBox = document.querySelector('.search');
let user;
userBtn.addEventListener('click', getUser);
checkBtn.addEventListener('click', getCheck);
goodsBtn.addEventListener('click', getGoods);
addBtn.addEventListener('click', addUser);

/**
 * 用户相关
 */
function getUser() {
    fetch('/admin/user', {
        method: 'GET',
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
            window.location.href = '/login'
        } else {
            user = response;
            mainDiv.innerHTML = `<button onclick="showSeller()">卖家</button>
                                 <button onclick="showCustomer()">买家</button><br>`;
        }
    })
}

function showSeller() {
    mainDiv.innerHTML = `<button onclick="showSeller()">卖家</button>
                         <button onclick="showCustomer()">买家</button><br>`;
    let sellers = user.seller;
    sellers.forEach(seller => {
        mainDiv.innerHTML += `<div id="${seller['_id']}">
            <p>用户名：${seller.user}</p>
            <p>邮箱：${seller.email}</p>
            <p>权限：卖家</p>
            <button onclick="deleteUser('${seller['_id']}')">删除用户</button>
        </div>`
    });
}

function showCustomer() {
    mainDiv.innerHTML = `<button onclick="showSeller()">卖家</button>
                         <button onclick="showCustomer()">买家</button><br>`;
    let customers = user.customer;
    customers.forEach(customer => {
        mainDiv.innerHTML += `<div id="${customer['_id']}">
            <p>用户名：${customer.user}</p>
            <p>邮箱：${customer.email}</p>
            <p>权限：买家</p>
            <button onclick="deleteUser('${customer['_id']}')">删除用户</button>
        </div>`
    });
}

function deleteUser(id) {
    fetch('/admin/user', {
        body: id,
        method: 'DELETE',
        credentials: 'include',
    }).then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Bad Request');
    }).then(response => {
        alert(response);
        mainDiv.removeChild(document.getElementById(`${id}`));
        user.seller = user.seller.filter(e => {
            return e['_id'] !== id
        });
        user.customer = user.customer.filter(e => {
            return e['_id'] !== id
        });
    }).catch(err => {
        alert(err.message);
        window.location.href = '/login';
    })
}

function addUser() {
    mainDiv.innerHTML = `<label for="users">用户名</label>
        <input placeholder="用户名" id="users"/>
        <br>
        <label for="email">邮箱</label>
        <input placeholder="邮箱" id="email"/>
        <br>
        <label for="password">密码</label>
        <input placeholder="密码" id="password" type="password"/>
        <br>
        <label><input type="radio" name="privilege" id="purchaser" checked="checked">买家</label>
        <label><input type="radio" name="privilege" id="merchant">商家</label>
        <button onclick="sentUser()">添加</button>`;
}

function sentUser() {
    let msg = {};
    msg.user = document.querySelector('#users').value;
    msg.email = document.querySelector('#email').value;
    msg.pwd = document.querySelector('#password').value;
    if (!emailReg.test(msg.email)) {
        alert('邮箱格式错误');
        return;
    } else if (!pwdReg.test(msg.pwd)) {
        alert('密码格式错误');
        return;
    } else if (!userReg.test(msg.user)) {
        alert('用户名格式错误');
        return;
    }
    if (document.querySelector('#purchaser').checked) {
        msg.privilege = 1;
    } else {
        msg.privilege = 2;
    }
    msg.pwd = hex_md5(msg.pwd + "shop").toUpperCase();
    let xhr = new XMLHttpRequest;
    xhr.open("post", "/api/signToDb", false);
    xhr.send(JSON.stringify(msg));
    if (xhr.responseText === "用户名已存在" || xhr.responseText === "邮箱已被注册") {
        alert(xhr.responseText);
    } else {
        alert(xhr.responseText)
    }
}

/**
 * 审核相关
 */
function getCheck() {
    fetch('/admin/checks', {
        method: 'GET',
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
            window.location.href = '/login'
        } else {
            mainDiv.innerHTML = '';
            response.list.forEach(check => showCheck(check))
        }
    })
}

function showCheck(obj) {
    let keyword = obj.keyword;
    keyword = keyword.join(' ');
    mainDiv.innerHTML += `<div id="${obj['_id']}" class="good">
    <br>
    <p>审核号：${obj['_id']}</p>
    <p>商品名：${obj.name}</p>
    <p>卖家：${obj.seller}</p>
    <p>价格：￥${(obj.price) / 100}</p>
    <p>数量：${obj.amount}</p>
    <p>关键词：${keyword}</p>
    <p>申请时间：${obj.time}</p>
    <button onclick="passCheck('${obj['_id']}')">通过</button>
    <button onclick="rejectCheck('${obj['_id']}')">拒绝</button>
    <br><br>
</div>`
}

function passCheck(id) {
    fetch('/admin/checks', {
        body: id,
        method: 'POST',
        credentials: 'include',
    }).then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Bad Request')
    }).then(response => {
        alert(response);
        mainDiv.removeChild(document.getElementById(`${id}`))
    }).catch(err => {
        alert(err.message)
    })
}

function rejectCheck(id) {
    fetch('/admin/checks', {
        body: id,
        method: 'PUT',
        credentials: 'include',
    }).then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Bad Request')
    }).then(response => {
        alert(response);
        mainDiv.removeChild(document.getElementById(`${id}`))
    }).catch(err => {
        alert(err.message)
    })
}

/**
 * 获取商品
 */
function getGoods(event, page = 1, keyword = searchBox.value) {
    if (keyword === '')
        return;
    fetch(`/admin/goods/${page}`, {
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

function showGood(obj) {
    let keyword = obj.keyword;
    keyword = keyword.join(' ');
    mainDiv.innerHTML += `<div class="good">
    <br>
    <p>商品号：${obj['_id']}</p>
    <p>商品名：${obj.name}</p>
    <p>卖家：${obj.seller}</p>
    <p>价格：￥${(obj.price) / 100}</p>
    <p>数量：${obj.amount}</p>
    <p>关键词：${keyword}</p>
    <br><br>
</div>`
}