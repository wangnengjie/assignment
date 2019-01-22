# import myModule
# from flask import Flask,Blueprint,send_file
# from flask_socketio import emit,send
# from service import socketio

# chat=Blueprint('chat',__name__)

# @socketio.on('connect',namespace='/chat')
# def connect():
#     emit('response','Success',namespace='/chat')

# @socketio.on('disconnect',namespace='/chat')
# def disconnect(data):
#     for i in data:
#         print(i)
#     print('disconnect')