from random import Random
from hashlib import md5, sha256
import pymongo
import base64
import json
import time
import hmac
from bson.objectid import ObjectId
connection = pymongo.MongoClient('127.0.0.1', 27017)
db = connection.shop
dbUser = db.user
dbGoods = db.goods
dbCart = db.cart
dbOrders = db.orders
dbChecks = db.checks


def anaSign(msg):
    flag = 0
    if type(dbUser.find_one({'user': msg['user']})) == dict:
        flag = 1
    elif type(dbUser.find_one({'email': msg['email']})) == dict:
        flag = 2
    elif msg['privilege'] != 1 or msg['privilege'] != 2:
        flag = 3
    return flag


def anaLog(msg):
    ana = {'flag': False}
    if msg['type'] == 0:
        user = dbUser.find_one({'user': msg['user']})
    else:
        user = dbUser.find_one({'email': msg['user']})
    if type(user) != dict:
        return ana
    pwd = msg['pwd']+user['salt']
    m = md5()
    m.update(pwd.encode('utf-8'))
    if m.hexdigest().upper() != user['pwd']:
        return ana
    ana['flag'] = True
    ana['user'] = user['user']
    return ana


def addUser(msg):
    salt = ''
    charList = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789!@#$%^&*'
    listLen = len(charList)-1
    random = Random()
    for i in range(10):
        salt += charList[random.randint(0, listLen)]
    pwd = msg['pwd']+salt
    m = md5()
    m.update(pwd.encode('utf-8'))
    msg['pwd'] = m.hexdigest().upper()
    msg['salt'] = salt
    dbUser.insert_one(msg)


def encodeJWT(msg):
    secret = '__UniqueMall__'
    a = {
        "alg": "HS256",
        "typ": "JWT"
    }
    b = {
        "user": msg['user'],
        "sub": "JWT",
        "exp": time.time()+86400
    }
    ac = base64.urlsafe_b64encode(str(a).encode('utf-8')).decode('utf-8')
    bc = base64.urlsafe_b64encode(str(b).encode('utf-8')).decode('utf-8')
    sign = hmac.new(secret.encode('utf-8'),
                    (ac+'.'+bc).encode('utf-8'), sha256).hexdigest()
    return ac+'.'+bc+'.'+sign


def deJWT(token):
    if type(token) != str:
        return False
    secret = '__UniqueMall__'
    JWT = token.split('.')
    two = False
    one = JWT[2] == hmac.new(secret.encode(
        'utf-8'), (JWT[0]+'.'+JWT[1]).encode('utf-8'), sha256).hexdigest()
    user = json.loads(base64.urlsafe_b64decode(
        JWT[1]).decode('utf-8').replace('\'', '\"'))['user']
    if type(dbUser.find_one({'user': user})) == dict:
        two = True
    return one and two


def getUserFromJWT(token):
    JWT = token.split('.')
    user = json.loads(base64.urlsafe_b64decode(
        JWT[1]).decode('utf-8').replace('\'', '\"'))['user']
    msg = dbUser.find_one({"user": user})
    return msg


def searchGoods(keyword):
    array = keyword.split(' ')
    msg = dbGoods.find({'keyword': {'$in': array}})
    goods = [good for good in msg]
    for good in goods:
        good['_id'] = str(good['_id'])
    return goods


def addToCart(msg, user):
    name = user['user']
    way = msg['type']
    goodsId = msg['id']
    k = dbCart.find_one({'user': name})
    if way == 0:
        i = filter(goodsCanFound, goodsId)
        if k == dict:
            k = k['goodsId']
            dbCart.update_one(
                {'user': name}, {'$set': {'goodsId': list(set(k+goodsId))}})
        else:
            dbCart.insert({'user': name, 'goodsId': i})
    elif way == 1:
        for i in goodsId:
            try:
                dbCart.update_one(
                    {'user': name}, {'$set': {'goodsId': k['goodsId'].remove(i)}})
            except:
                continue
    return 200


def searchCart(user):
    msg = dbCart.find_one({'user': user['user']})['goodsId']
    a = []
    for good in msg:
        i = dbGoods.find_one({'_id': ObjectId(good)})
        if i is None:
            dbCart.update_one({'user': user['user']}, {
                              '$set': {'goodsId': msg.remove(good)}})
        else:
            a.append(i)
    for good in a:
        good['_id'] = str(good['_id'])
    return a


def goodsCanFound(id):
    try:
        if dbGoods.find_one({'_id': ObjectId(id)}) == dict:
            return True
        else:
            return False
    except:
        return False


def makeOrders(user, msg):
    for key, value in msg['goods']:
        try:
            good = dbGoods.find_one({'_id': ObjectId(key)})
            if good is None:
                return 400
            elif good['amount'] < value:
                return 400
            order = {
                'customer': user['user'],
                'goodsName': good['name'],
                'goodsId': key,
                'amount': value,
                'seller': good['seller'],
                'price': value*good['price']
            }
            order['adds'] = msg['adds']
            order['time'] = time.strftime(
                "%Y-%m-%d %H:%M:%S", time.localtime())
            dbOrders.insert_one(order)
            dbGoods.update_one({'_id': ObjectId(key)}, {
                               '$set': {'amount': good['amount']-value}})
        except:
            return 400
    return 200


def getOrders(user):
    if user['privilege'] == 1:
        orders = dbOrders.find({'customer': user['user']})
    elif user['privilege'] == 2:
        orders = dbOrders.find({'seller': user['user']})
    elif user['privilege'] == 0:
        order = dbOrders.find()

    orders = [order for order in orders]
    for order in orders:
        order['_id'] = str(order['_id'])
    return orders


def getGoods(user):
    if user['privilege'] == 2:
        goods = dbGoods.find({'seller': user['user']})
    elif user['privilege'] == 0:
        goods = dbGoods.find()

    goods = [good for good in goods]
    for good in goods:
        good['_id'] = str(good['_id'])
    return goods


def getCheck(user):
    if user['privilege'] == 2:
        goods = dbChecks.find({'seller': user['user']})
    elif user['privilege'] == 0:
        goods = dbChecks.find({'status': 0})

    goods = [good for good in goods]
    for good in goods:
        good['_id'] = str(good['_id'])
    return goods


def setCheck(user, msg):
    key = msg['keyword']
    key.append(msg['name'])
    a = {
        "name": msg['name'],
        "seller": user['user'],
        "amount": msg['amount'],
        "price": msg['price'],
        "keyword": key,
        "time": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
        "status": 0
    }
    dbChecks.insert_one(a)
    return


def deleteGoods(msg):
    # 从商城下架
    if msg['type'] == 1:
        dbGoods.delete_one({'_id': ObjectId(msg['_id'])})
    # 从待审核栏下架
    elif msg['type'] == 2:
        dbChecks.delete_one({'_id': ObjectId(msg['_id'])})
    return


def updateGoods(user, msg):
    # 从待审核处更新
    if msg['type'] == 2:
        a = {
            "name": msg['name'],
            "seller": user['user'],
            "amount": msg['amount'],
            "price": msg['price'],
            "keyword": msg['keyword'],
            "time": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
            "status": 0
        }
        dbChecks.update_one({'_id': ObjectId(msg['id'])}, {'$set': a})
    # 从商城架上更新
    elif msg['type'] == 1:
        deleteGoods(msg)
        setCheck(user, msg)
    return


def getUser(i):
    users = dbUser.find({'privilege': i})
    users = [user for user in users]
    for user in users:
        user['_id'] = str(user['_id'])
    return users


# 后续聊天室还有需要删除的东西！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
def deleteUser(msg):
    user = dbUser.finf_one({'_id': ObjectId(msg)})
    privilege = user['privilege']
    if privilege == 0:
        return
    elif privilege == 1:
        dbUser.delete_one({'_id': ObjectId(msg)})
        dbCart.remove({'user': user['name']})
    elif privilege == 2:
        dbUser.delete_one({'_id': ObjectId(msg)})
        dbGoods.remove({'seller': user['name']})
        dbChecks.remove({'seller': user['name']})
    return


def rejectCheck(msg):
    dbChecks.update_one({'_id': ObjectId(msg)}, {'$set': {'status': -1}})
    return


def passCheck(msg):
    good = dbChecks.find_one({'_id': ObjectId(msg)})
    a = {
        'name': good['name'],
        'seller': good['seller'],
        'amount': good['amount'],
        'price': good['price'],
        'keyword': list(set(good['keyword']))
    }
    dbGoods.insert_one(a)
    dbChecks.delete_one({'_id': ObjectId(msg)})
    return