from random import Random
from hashlib import md5, sha256
import datetime
import pymongo
import base64
import json
import time
import hmac
from bson.objectid import ObjectId
from bson import json_util
connection = pymongo.MongoClient('localhost', 27017)
db = connection.shop
dbUser = db.user
dbGoods = db.goods
dbCart = db.cart
dbOrders = db.order
dbChecks = db.checks
dbRecords = db.records
dbRecords.create_index([("time", 1)],
                       expireAfterSeconds=259200)
# print(dbOrders.find_one({'_id':ObjectId('5c4302cfa6763401c1353e42')})['time']+datetime.timedelta(hours=8))
# dbOrders.insert_one({'time':datetime.datetime.utcnow()})


def anaSign(msg):
    flag = 0
    if type(dbUser.find_one({'user': msg['user']})) == dict:
        flag = 1
    elif type(dbUser.find_one({'email': msg['email']})) == dict:
        flag = 2
    elif msg['privilege'] != 1 and msg['privilege'] != 2:
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
    ana['privilege'] = user['privilege']
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


def searchGoods(keyword, page):
    array = keyword.split(' ')
    msg = dbGoods.find({'keyword': {'$in': array}}).skip(
        (int(page)-1)*10).limit(11)
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
        i = list(filter(goodsCanFound, goodsId))
        if type(k) == dict:
            k = k['goodsId']
            dbCart.update_one(
                {'user': name}, {'$set': {'goodsId': list(set(k+goodsId))}})
        else:
            dbCart.insert({'user': name, 'goodsId': i})
    elif way == 1:
        k = k['goodsId']
        for i in goodsId:
            try:
                k.remove(i)
                dbCart.update_one(
                    {'user': name}, {'$set': {'goodsId': k}})
            except:
                continue
    return 200


def searchCart(user):
    msg = dbCart.find_one({'user': user['user']})['goodsId']
    if len(msg) == 0:
        return []
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
        if type(dbGoods.find_one({'_id': ObjectId(id)})) == dict:
            return True
        else:
            return False
    except:
        return False


def makeOrders(user, msg):
    for key, value in msg['goods'].items():
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
            order['time'] = datetime.datetime.utcnow() + \
                datetime.timedelta(hours=8)
            dbOrders.insert_one(order)
            dbGoods.update_one({'_id': ObjectId(key)}, {
                               '$set': {'amount': good['amount']-value}})
            k = dbCart.find_one({'user': user['user']})
            k = k['goodsId']
            k.remove(key)
            dbCart.update_one(
                {'user': user['user']}, {'$set': {'goodsId': k}})
        except:
            return 400
    return 200


def getOrders(user):
    if user['privilege'] == 1:
        orders = dbOrders.find({'customer': user['user']}).sort(
            'time', pymongo.DESCENDING)
    elif user['privilege'] == 2:
        orders = dbOrders.find({'seller': user['user']}).sort(
            'time', pymongo.DESCENDING)
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
        goods = dbChecks.find({'seller': user['user']}).sort('time')
    elif user['privilege'] == 0:
        goods = dbChecks.find({'status': 0}).sort('time')

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
        "time": datetime.datetime.utcnow()+datetime.timedelta(hours=8),
        "status": 0
    }
    dbChecks.insert_one(a)
    return


def deleteGoods(user, msg):
    # 从商城下架
    if msg['type'] == 1:
        if user['user'] != dbGoods.find_one({'_id': ObjectId(msg['_id'])})['seller']:
            return 400
        dbGoods.delete_one({'_id': ObjectId(msg['_id'])})
    # 从待审核栏下架
    elif msg['type'] == 2:
        if user['user'] != dbChecks.find_one({'_id': ObjectId(msg['_id'])})['seller']:
            return 400
        dbChecks.delete_one({'_id': ObjectId(msg['_id'])})
    return 200


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
        dbChecks.update_one({'_id': ObjectId(msg['_id'])}, {'$set': a})
    # 从商城架上更新
    elif msg['type'] == 1:
        deleteGoods(user, msg)
        setCheck(user, msg)
    return


def getUser():
    customers = dbUser.find({'privilege': 1})
    sellers = dbUser.find({'privilege': 2})
    customers = [customer for customer in customers]
    sellers = [seller for seller in sellers]
    for customer in customers:
        del customer['salt']
        customer['_id'] = str(customer['_id'])
    for seller in sellers:
        del seller['salt']
        seller['_id'] = str(seller['_id'])
    return {'seller': sellers, 'customer': customers}


# 后续聊天室还有需要删除的东西！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
def deleteUser(msg):
    user = dbUser.find_one({'_id': ObjectId(msg)})
    privilege = user['privilege']
    if privilege == 0:
        return
    elif privilege == 1:
        dbUser.delete_one({'_id': ObjectId(msg)})
        dbCart.remove({'user': user['user']})
        dbRecords.remove(
            {'$or': [{'from': user['user']}, {'to': user['user']}]})
    elif privilege == 2:
        dbUser.delete_one({'_id': ObjectId(msg)})
        dbGoods.remove({'seller': user['user']})
        dbChecks.remove({'seller': user['user']})
        dbRecords.remove(
            {'$or': [{'from': user['user']}, {'to': user['user']}]})
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


def findRecord(user, target):
    records=dbRecords.find(
        {'$or': [{'from': user, 'to': target}, {'from': target, 'to': user}]},{'_id':0}).sort('time')
    msg = [record for record in records]
    dbRecords.update({'to': user,'from':target}, {'$set': {'recv': 1}})
    return json.dumps(msg,default=json_util.default)

def getRecord(user):
    recent = set()
    unread = dbRecords.find({'to': user['user'], 'recv': 0}).count()
    records = dbRecords.find(
        {'$or': [{'from': user['user']}, {'to': user['user']}]})
    msg = [record for record in records]
    for i in msg:
        recent.add(i['from'])
        recent.add(i['to'])
    return json.dumps({'user': user['user'], 'unread': unread, 'resent': list(recent)}, default=json_util.default)


def insertRecord(msg, geted):
    msg['time'] = datetime.datetime.utcnow()+datetime.timedelta(hours=8)
    msg['recv'] = geted
    dbRecords.insert_one(msg)
