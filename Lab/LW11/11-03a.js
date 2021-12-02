const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:4000/pingpong')

socket.on('open',()=>{
    console.log('Client socket open');
})

socket.on('message', (mes)=>{
    console.log('Message form server: ',mes.toString('utf-8'));
})

socket.on('ping',()=>{
    //socket.pong();
    console.log('on ping');
})

socket.on('pong',()=>{
    console.log('on pong');
})