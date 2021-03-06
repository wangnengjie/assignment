from flask import Flask, render_template, request, redirect, url_for, json, jsonify, make_response, send_file, send_from_directory
from customer import customer
from seller import seller
from admin import admin
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from bson import json_util
import pymongo
import json
import myModule
import os
app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
app.register_blueprint(customer)
app.register_blueprint(seller)
app.register_blueprint(admin)
app.debug = True
socketio = SocketIO(app)
user_chat = {}
user_list = []


@app.route('/')
def welcome():
    token = request.cookies.get('token')
    if myModule.deJWT(token):
        user = myModule.getUserFromJWT(token)
        if user['privilege'] == 0:
            resp = make_response(redirect(url_for('welAdmin')))
        elif user['privilege'] == 1:
            resp = make_response(redirect(url_for('welCustomer')))
        elif user['privilege'] == 2:
            resp = make_response(redirect(url_for('welSeller')))
        else:
            return 'Bad Request', 400
        return resp
    return send_file("./html/index.html")


@app.route('/login')
def log():
    return send_file("./html/logIn.html")


@app.route('/signin')
def sign():
    return send_file("./html/signIn.html")


@app.route('/api/admin')
def welAdmin():
    token = request.cookies.get('token')
    if not myModule.deJWT(token):
        return redirect("/")
    user = myModule.getUserFromJWT(token)
    if user['privilege'] != 0:
        return '请重新登录', 400
    return send_file('./html/admin.html')


@app.route('/api/seller')
def welSeller():
    token = request.cookies.get('token')
    if not myModule.deJWT(token):
        return redirect("/")
    user = myModule.getUserFromJWT(token)
    if user['privilege'] != 2:
        return '请重新登录', 400
    return send_file('./html/seller.html')


@app.route('/api/customer')
def welCustomer():
    token = request.cookies.get('token')
    if not myModule.deJWT(token):
        return redirect("/")
    user = myModule.getUserFromJWT(token)
    if user['privilege'] != 1:
        return '请重新登录', 400
    return send_file('./html/Mall.html')


@app.route('/api/signToDb', methods=['GET', 'POST'])
def signToDb():
    if request.method == 'POST':
        msg = json.loads(request.get_data().decode('utf-8'))
        if msg['privilege'] == 0:
            return 'Bad Request', 400
        flag = myModule.anaSign(msg)
        if flag == 0:
            token = request.cookies.get('token')
            if type(token) == str:
                user = myModule.getUserFromJWT(token)
                if user['privilege'] == 0:
                    myModule.addUser(msg)
                    return 'OK', 200
            myModule.addUser(msg)
            JWT = myModule.encodeJWT(msg)
            if msg['privilege'] == 1:
                resp = make_response(redirect(url_for('welCustomer')))
            elif msg['privilege'] == 2:
                resp = make_response(redirect(url_for('welSeller')))
            resp.set_cookie("token", JWT, httponly=True, max_age=86400)
            return resp
        elif flag == 1:
            return '用户名已存在', 400
        elif flag == 2:
            return '邮箱已被注册', 400
        else:
            return 'Bad Request', 400


@app.route('/api/logToMall', methods=['GET', 'POST'])
def logToMall():
    if request.method == 'POST':
        msg = json.loads(request.get_data().decode('utf-8'))
        ana = myModule.anaLog(msg)
        if ana['flag']:
            if ana['privilege'] == 0:
                resp = make_response(redirect(url_for('welAdmin')))
            elif ana['privilege'] == 1:
                resp = make_response(redirect(url_for('welCustomer')))
            elif ana['privilege'] == 2:
                resp = make_response(redirect(url_for('welSeller')))
            else:
                return 'Bad Request', 400
            JWT = myModule.encodeJWT(ana)
            resp.set_cookie("token", JWT, httponly=True, max_age=86400)
            return resp
        else:
            return '账号或密码错误', 400


@app.route('/api/logout')
def logout():
    resp = make_response(redirect('/'))
    resp.delete_cookie('token')
    return resp


@app.errorhandler(404)
def page_not_found(error):
    return '404'


@app.route('/api/online')
def test_chat():
    token = request.cookies.get('token')
    if not myModule.deJWT(token):
        return '请重新登录', 400
    return str(user_list)


@app.route('/api/record', methods=['GET', 'POST'])
def findRecord():
    if request.method == 'POST':
        token = request.cookies.get('token')
        if not myModule.deJWT(token):
            return '请重新登录', 400
        user = myModule.getUserFromJWT(token)
        target = request.get_data().decode('utf-8')
        record = myModule.findRecord(user['user'], target)
        return jsonify({'msg': json.loads(record)}), 200
    return 'Bad Request', 400


@socketio.on('connect', namespace='/api/chat')
def test_connect():
    token = request.cookies.get('token')
    if not myModule.deJWT(token):
        emit('error', '请重新登录')
    else:
        user = myModule.getUserFromJWT(token)
        user_chat[user['user']] = request.sid
        user_list.append(user['user'])
        records = myModule.getRecord(user)
        emit('my response', records)


@socketio.on('disconnect', namespace='/api/chat')
def test_disconnect():
    token = request.cookies.get('token')
    user = myModule.getUserFromJWT(token)
    user_chat.pop(user['user'])
    user_list.remove(user['user'])


@socketio.on('msg', namespace='/api/chat')
def sent_msg(data):
    token = request.cookies.get('token')
    if not myModule.deJWT(token):
        emit('error', '请重新登录', room=request.sid)
        return 0
    else:
        get = 0
        user = myModule.getUserFromJWT(token)
        data['from'] = user['user']
        target = user_chat.get(data['to'])
        if target != None:
            get = 1
            myModule.insertRecord(data, get)
            data.pop('_id')
            emit('recvMsg', json.dumps(
                data, default=json_util.default), room=target)
        else:
            myModule.insertRecord(data, get)
            data.pop('_id')
        return json.dumps(data, default=json_util.default)


# ,host='0.0.0.0'
if __name__ == '__main__':
    socketio.run(app, port=8888)
