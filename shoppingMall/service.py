from flask import Flask,render_template,request,redirect,url_for,json,jsonify
from random import Random
from hashlib import md5
import pymongo
import json
app=Flask(__name__)

@app.route('/')
def welcome():
    return render_template('index.html')

@app.route('/login')
def log():
    return render_template('logIn.html')

@app.route('/signin',methods=['GET', 'POST'])
def sign():
    if request.method == 'POST':
        msg=json.loads(request.get_data().decode('utf-8'))
        flag=anaSign(msg)
        if flag==0:
            addUser(msg)
            return redirect(url_for('mainPage',user_id=msg['user'],privilege=msg['privilege']))
        elif flag==1:
            return '用户名已存在'
        elif flag==2:
            return '邮箱已被注册'
    else:
        return render_template('signIn.html')

@app.route('/Mall?user_id=<user_id>&privilege=<privilege>',methods=['GET', 'POST'])
def mainPage(user_id,privilege):
    return render_template('Mall.html',user_id=user_id)

def anaSign(msg):
    flag=0
    if type(dbUser.find_one({'user':msg['user']}))==dict:
        flag=1
    elif type(dbUser.find_one({'email':msg['email']}))==dict:
        flag=2
    return flag
    
def addUser(msg):
    salt=''
    charList='AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789!@#$%^&*'
    listLen=len(charList)-1
    random=Random()
    for i in range(10):
        salt+=charList[random.randint(0,listLen)]
    pwd=msg['pwd']+salt
    m=md5()
    m.update(pwd.encode('utf-8'))
    msg['pwd']=m.hexdigest().upper()
    msg['salt']=salt
    dbUser.insert_one(msg)

if __name__=='__main__':
    connection=pymongo.MongoClient('127.0.0.1',27017)
    db=connection.shop
    dbUser=db.user
    dbGoods=db.goods
    app.run(port=8888)