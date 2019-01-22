const socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + '/api/chat');
socket.on('connect', function () {
    socket.emit('my event', {data: 'I\'m connected!'});
});

socket.on('my response', msg => {
    if(typeof msg==="string")
        msg=JSON.parse(msg);
    console.log(msg);
});