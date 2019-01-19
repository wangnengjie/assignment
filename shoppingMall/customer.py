from flask import Flask, render_template, request, redirect, url_for, json, jsonify, make_response, send_file, send_from_directory, Blueprint
from random import Random
from hashlib import md5, sha256
import pymongo
import json
import time
import hmac
import base64
import myModule

customer = Blueprint('customer', __name__)


@customer.route('/customer/goods/<page>',methods=['GET','POST'])
def goods(page):
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


@customer.route('/customer/carts', methods=['GET', 'POST'])
def handleCart():
    token = request.cookies.get('token')
    if not myModule.deJWT(token):
        return '请重新登录', 400
    user = myModule.getUserFromJWT(token)
    if user['privilege'] != 1:
        return '请重新登录', 400

    if request.method == 'GET':
        goods = myModule.searchCart(user)
        msg = {
            'amount': len(goods),
            'list': goods
        }
        return jsonify(msg), 200
    if request.method == 'POST':
        msg = json.loads(request.get_data().decode('utf-8'))
        sta = myModule.addToCart(msg, user)
        return 'OK', sta
    return 'Bad Request', 400


@customer.route('/customer/orders', methods=['GET', 'POST'])
def orders():
    token = request.cookies.get('token')
    if not myModule.deJWT(token):
        return '请重新登录', 400
    user = myModule.getUserFromJWT(token)
    if user['privilege'] != 1:
        return '请重新登录', 400

    if request.method == 'GET':
        orders = myModule.getOrders(user)
        msg = {
            'amount': len(orders),
            'list': orders
        }
        return jsonify(msg), 200
    if request.method == 'POST':
        msg = json.loads(request.get_data().decode('utf-8'))
        status = myModule.makeOrders(user, msg)
        if status == 400:
            return "Bad Request", 400
        if status == 200:
            return "OK", 200
