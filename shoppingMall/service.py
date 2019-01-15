from flask import Flask,render_template,request,redirect,url_for,json,jsonify,make_response,send_file,send_from_directory
from random import Random
from hashlib import md5,sha256
import pymongo,json,time,hmac,base64
app=Flask(__name__)

@app.route('/')
def welcome():
    token=request.cookies.get('token')
    if deJWT(token):
        return redirect("/Mall")
    return send_file("./html/index.html")

@app.route('/login')
def log():
    return send_file("./html/logIn.html")

@app.route('/signin')
def sign():
    return send_file("./html/signIn.html")

@app.route('/Mall')
def mainPage():
    token=request.cookies.get('token')
    if not deJWT(token):
        return redirect("/")
    JWT=token.split('.')
    user=json.loads(base64.urlsafe_b64decode(JWT[1]).decode('utf-8').replace('\'','\"'))['user']
    privilege=dbUser.find_one({"user":user})['privilege']
    return send_file("./html/Mall.html")

@app.route('/signToDb',methods=['GET', 'POST'])
def signToDb():
    if request.method == 'POST':
        msg=json.loads(request.get_data().decode('utf-8'))
        flag=anaSign(msg)
        if flag==0:
            addUser(msg)
            JWT=encodeJWT(msg)
            resp=make_response(redirect(url_for('mainPage')))
            resp.set_cookie("token",JWT,httponly=True,max_age=86400)
            return resp
        elif flag==1:
            
            return '用户名已存在'
        elif flag==2:
            return '邮箱已被注册'

@app.route('/logToMall',methods=['GET','POST'])
def logToMall():
    if request.method=='POST':
        msg=json.loads(request.get_data().decode('utf-8'))
        ana=anaLog(msg)
        if ana['flag']:
            resp=make_response(redirect(url_for('mainPage')))
            JWT=encodeJWT(ana)
            resp.set_cookie("token",JWT,httponly=True,max_age=86400)
            return resp
        else:
            return '账号或密码错误'

def anaSign(msg):
    flag=0
    if type(dbUser.find_one({'user':msg['user']}))==dict:
        flag=1
    elif type(dbUser.find_one({'email':msg['email']}))==dict:
        flag=2
    return flag

def anaLog(msg):
    ana={'flag':False}
    if msg['type']==0:
        user=dbUser.find_one({'user':msg['user']})
    else:
        user=dbUser.find_one({'email':msg['user']})
    if type(user)!=dict:
        return ana
    pwd=msg['pwd']+user['salt']
    m=md5()
    m.update(pwd.encode('utf-8'))
    if m.hexdigest().upper()!=user['pwd']:
        return ana
    ana['flag']=True
    ana['user']=user['user']
    return ana    

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

def encodeJWT(msg):
    secret='__UniqueMall__'
    a={
        "alg":"HS256",
        "typ":"JWT"
    }
    b={
        "user":msg['user'],
        "sub":"JWT",
        "exp":time.time()+86400
    }
    ac=base64.urlsafe_b64encode(str(a).encode('utf-8')).decode('utf-8')
    bc=base64.urlsafe_b64encode(str(b).encode('utf-8')).decode('utf-8')
    sign=hmac.new(secret.encode('utf-8'),(ac+'.'+bc).encode('utf-8'),sha256).hexdigest()
    return ac+'.'+bc+'.'+sign

def deJWT(token):
    if type(token)!=str:
        return False
    secret='__UniqueMall__'
    JWT=token.split('.')
    two=False
    one=JWT[2]==hmac.new(secret.encode('utf-8'),(JWT[0]+'.'+JWT[1]).encode('utf-8'),sha256).hexdigest()
    user=json.loads(base64.urlsafe_b64decode(JWT[1]).decode('utf-8').replace('\'','\"'))['user']
    if type(dbUser.find_one({'user':user}))==dict:
        two=True
    return  one and two

def getUserFromJWT(token):
    JWT=token.split('.')
    return json.loads(base64.urlsafe_b64decode(JWT[1]).decode('utf-8').replace('\'','\"'))['user']

if __name__=='__main__':
    connection=pymongo.MongoClient('127.0.0.1',27017)
    db=connection.shop
    dbUser=db.user
    dbGoods=db.goods
    app.run(debug=True,port=8888)