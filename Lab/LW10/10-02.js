let WebSocket = require('ws');

let i = 0;
let socket = new WebSocket('ws:/localhost:4000/wsserver');

socket.on('open', ()=>{
    console.log('Socket open');
    setInterval(() => {
        socket.send(++i)
    }, 3000);
    setTimeout(() => {
        socket.close();
    }, 25000);
})

socket.on('close', (e)=>{
    console.log('Socket close ', e);
})

socket.on('message', (e)=>{
    console.log('Socket message: ',e.toString('utf-8'));
})
socket.on('error', (e)=>{
    console.log('Socket error: ', e.message);
})