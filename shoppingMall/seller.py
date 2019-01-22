from flask import Flask, render_template, request, redirect, url_for, json, jsonify, make_response, send_file, send_from_directory, Blueprint
import pymongo
import json
import time
import myModule

seller = Blueprint('seller', __name__)


@seller.route('/seller/orders')
def orders():
    token = request.cookies.get('token')
    if not myModule.deJWT(token):
        return '请重新登录', 400
    user = myModule.getUserFromJWT(token)
    if user['privilege'] != 2:
        return '请重新登录', 400

    orders = myModule.getOrders(user)
    return jsonify({'amount': len(orders), 'list': orders}), 200


@seller.route('/seller/goods', methods=['GET', 'POST', 'DELETE', 'PUT'])
def goods():
    token = request.cookies.get('token')
    if not myModule.deJWT(token):
        return '请重新登录', 400
    user = myModule.getUserFromJWT(token)
    if user['privilege'] != 2:
        return '请重新登录', 400
    # 获取商品信息
    if request.method == 'GET':
        good1 = myModule.getGoods(user)
        good2 = myModule.getCheck(user)
        return jsonify({'on': good1, 'check': good2}),200
    # 上架商品（送去审核）
    if request.method == 'POST':
        try:
            msg = json.loads(request.get_data().decode('utf-8'))
            myModule.setCheck(user, msg)
            return 'OK', 200
        except:
            return 'Bad Request', 400
    # 下架商品
    if request.method == 'DELETE':
        try:
            msg = json.loads(request.get_data().decode('utf-8'))
            status=myModule.deleteGoods(user,msg)
            if status==400:
                return 'Bad Request',400
            return 'OK', 200
        except:
            return 'Bad Request', 400
    # 修改商品信息（先下架后审核再上架）
    if request.method == 'PUT':
        try:
            msg = json.loads(request.get_data().decode('utf-8'))
            myModule.updateGoods(user, msg)
            return 'OK', 200
        except:
            return 'Bad Request', 400
