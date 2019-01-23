const chatBtn = document.querySelector('#chat');
const socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + '/api/chat');
let recordMsg;
socket.on('connect', function () {
    socket.emit('my event', {data: 'I\'m connected!'});
});

socket.on('my response', msg => {
    if (typeof msg === "string")
        msg = JSON.parse(msg);
    recordMsg = msg;
    if (msg.unread > 0) {
        chatBtn.innerText += `(${msg.unread})`;
    }
});

socket.on('error', msg => {
    alert(msg);
    window.location.href = '/'
});

socket.on('recvMsg', msg => {
    if (typeof msg === "string")
        msg = JSON.parse(msg);
    showRecv(msg);
});

chatBtn.addEventListener('click', showChat);

function showChat() {
    if (chatBtn.innerText !== '聊天室') {
        chatBtn.innerText = '聊天室'
    }
    mainDiv.innerHTML = '';
    let resent = recordMsg.resent;
    let temp = '';
    resent.forEach(target => {
        if (target === recordMsg.user)
            return;
        temp += `<button onclick="startChat('${target}')" id="${target}">${target}</button><br>`
    });
    mainDiv.innerHTML = `<div class="recent-list">${temp}</div><div class="chat-window"></div>`
}

function startChat(target) {
    let t = document.querySelector(`#${target}`);
    if (t.innerText !== target) {
        t.innerText = target;
    }

    let win = document.querySelector('.chat-window');
    win.innerHTML = `<div class="subdiv" id="connect-${target}"></div><input type="text" style="width: 40vw"> <button onclick="send('${target}',this)">发送</button>`;
    fetch('/api/record', {
        body: target,
        method: 'POST',
        credentials: 'include'
    }).then(respond => {
        if (respond.ok)
            return respond.json();
        else
            return respond.text();
    }).then(data => {
        if (typeof data === "string")
            alert(data);
        else
            showRecord(data);
    })
}

function showRecord(data) {
    let win = document.querySelector('.subdiv');
    let time, M, D, h, m, place;
    data.msg.forEach(record => {
        time = new Date(record.time['$date'] - 28800000);
        M = (time.getMonth() + 1) + '-';
        D = time.getDate() + ' ';
        h = time.getHours() + ':';
        m = ((time.getMinutes() < 10) ? '0' + time.getMinutes() : time.getMinutes()) + ' ';
        place = (record.from === recordMsg.user) ? 'right' : 'left';
        win.innerHTML += `<div class="msg" style="float: ${place};"><span>${M + D + h + m}</span><br>
                        <p>\t ${record.msg}</p></div><div style="clear:both;border: none"><br></div>`;
    });
    win.scrollTop=win.scrollHeight;
}

function showRecv(msg) {
    //如果没进入聊天室
    if (!document.querySelector('.recent-list')) {
        if (chatBtn.innerText === '聊天室') {
            chatBtn.innerText = '聊天室' + '(1)'
        } else {
            let temp = parseInt(chatBtn.innerText.replace(/[^0-9]/ig, "")) + 1;
            chatBtn.innerText = `聊天室(${temp})`;
        }
    } else {
        //如果已进入聊天室
        let fromWho = msg['from'];
        let win = document.querySelector('.subdiv');
        //如果就在当前窗口
        if (document.querySelector(`#connect-${fromWho}`)) {
            let time, M, D, h, m, place;
            time = new Date(msg.time['$date'] - 28800000);
            M = (time.getMonth() + 1) + '-';
            D = time.getDate() + ' ';
            h = time.getHours() + ':';
            m = ((time.getMinutes() < 10) ? '0' + time.getMinutes() : time.getMinutes()) + ' ';
            place = (msg.from === recordMsg.user) ? 'right' : 'left';
            win.innerHTML += `<div class="msg" style="float: ${place};"><span>${M + D + h + m}</span><br>
                        <p>\t ${msg.msg}</p></div><div style="clear:both;border: none"><br></div>`;
            win.scrollTop=win.scrollHeight;
        } else if (!document.querySelector(`#${fromWho}`)) {
            recordMsg.resent.push(fromWho);
            let node = document.querySelector('.recent-list');
            node.innerHTML += `<button onclick="startChat('${fromWho}')" id="${fromWho}">${fromWho}(new)</button><br>`
        } else {
            document.querySelector(`#${fromWho}`).innerText = `${fromWho}(new)`;
        }
    }
}

function send(target, node) {
    let msgBox = node.previousElementSibling;
    if (msgBox.value === '')
        return;
    socket.emit('msg', {'to': target, 'msg': msgBox.value}, data => {
        if (data === 0) {
            alert('error');
            window.location.href = '/';
            //这里其实就退出了？？应该是吧
        }
        let msg = JSON.parse(data);
        let win = document.querySelector('.subdiv');
        let time, M, D, h, m, place;
        time = new Date(msg.time['$date'] - 28800000);
        M = (time.getMonth() + 1) + '-';
        D = time.getDate() + ' ';
        h = time.getHours() + ':';
        m = ((time.getMinutes() < 10) ? '0' + time.getMinutes() : time.getMinutes()) + ' ';
        place = (msg.from === recordMsg.user) ? 'right' : 'left';
        win.innerHTML += `<div class="msg" style="float: ${place};"><span>${M + D + h + m}</span><br>
                        <p>\t ${msg.msg}</p></div><div style="clear:both;border: none"><br></div>`;
        win.scrollTop=win.scrollHeight;
        msgBox.value = '';
    });
}