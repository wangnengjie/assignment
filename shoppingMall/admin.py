from flask import Flask, render_template, request, redirect, url_for, json, jsonify, make_response, send_file, send_from_directory, Blueprint
import pymongo
import json
import time
import myModule

admin = Blueprint('admin', __name__)


@admin.route('/admin/user', methods=['GET', 'POST', 'DELETE'])
def handleUser():
    token = request.cookies.get('token')
    if not myModule.deJWT(token):
        return '请重新登录', 400
    user = myModule.getUserFromJWT(token)
    if user['privilege'] != 0:
        return '请重新登录', 400
    if request.method == 'GET':
        try:
            users = myModule.getUser()
            return jsonify(users), 200
        except:
            return 'Bad Request', 400

    if request.method == 'POST':
        try:
            msg = json.loads(request.get_data().decode('utf-8'))
            flag = myModule.anaSign(msg)
            if flag == 0:
                myModule.addUser(msg)
                return 'OK', 200
            elif flag == 1:
                return '用户名已存在', 400
            elif flag == 2:
                return '邮箱已被注册', 400
            else:
                return 'Bad Request', 400
        except:
            return 'Bad Request', 400

    if request.method == 'DELETE':
        try:
            msg = request.get_data().decode('utf-8')
            myModule.deleteUser(msg)
            return 'OK', 200
        except:
            return 'Bad Request', 400


@admin.route('/admin/checks', methods=['GET', 'PUT', 'POST'])
def handleChecks():
    token = request.cookies.get('token')
    if not myModule.deJWT(token):
        return '请重新登录', 400
    user = myModule.getUserFromJWT(token)
    if user['privilege'] != 0:
        return '请重新登录', 400

    if request.method == 'GET':
        try:
            goods = myModule.getCheck(user)
            return jsonify({'number': len(goods), 'list': goods}), 200
        except:
            return 'Bad Request', 400

    if request.method == 'PUT':
        try:
            msg = request.get_data().decode('utf-8')
            myModule.rejectCheck(msg)
            return 'OK', 200
        except:
            return 'Bad Request', 400

    if request.method == 'POST':
        try:
            msg = request.get_data().decode('utf-8')
            myModule.passCheck(msg)
            return 'OK', 200
        except:
            return 'Bad Request', 400


@admin.route('/admin/goods/<page>', methods=['GET', 'POST'])
def agoods(page):
    if request.method == 'POST':
        try:
            token = request.cookies.get('token')
            if not myModule.deJWT(token):
                return '请重新登录', 400
            keyword = request.get_data().decode('utf-8')
            goods = myModule.searchGoods(keyword, page)
            msg = {
                'amount': len(goods),
                'list': goods
            }
            return jsonify(msg)
        except:
            return 'Bad Request', 400
    return 'Bad Request', 400
