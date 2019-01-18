from flask import Flask, render_template, request, redirect, url_for, json, jsonify, make_response, send_file, send_from_directory
from customer import customer
from seller import seller
from admin import admin
import pymongo
import json
import myModule

app = Flask(__name__)
app.register_blueprint(customer)
app.register_blueprint(seller)
app.register_blueprint(admin)


@app.route('/')
def welcome():
    token = request.cookies.get('token')
    if myModule.deJWT(token):
        return redirect("/api/Mall")
    return send_file("./html/index.html")


@app.route('/login')
def log():
    return send_file("./html/logIn.html")


@app.route('/signin')
def sign():
    return send_file("./html/signIn.html")


@app.route('/api/Mall')
def mainPage():
    token = request.cookies.get('token')
    if not myModule.deJWT(token):
        return redirect("/")
    userMsg = myModule.getUserFromJWT(token)
    # if userMsg['privilege'] == 1:
    return send_file('./html/Mall.html')


@app.route('/api/signToDb', methods=['GET', 'POST'])
def signToDb():
    if request.method == 'POST':
        msg = json.loads(request.get_data().decode('utf-8'))
        flag = myModule.anaSign(msg)
        if flag == 0:
            myModule.addUser(msg)
            JWT = myModule.encodeJWT(msg)
            resp = make_response(redirect(url_for('mainPage')))
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
            resp = make_response(redirect(url_for('mainPage')))
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


if __name__ == '__main__':
    app.run(debug=True, port=8888)
