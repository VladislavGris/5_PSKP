const WebSocket = require('ws')

const socket = new WebSocket('ws://localhost:4000/json')
let client_name = process.argv[2];
let message = {client:client_name, timestamp:null}
socket.on('open',()=>{
    setInterval(() => {
        message.timestamp = Date.now();
        socket.send(JSON.stringify(message));
    }, 5000);
    socket.on('message',(mes)=>{
        console.log(`Message from server: ${mes}`);
    })
})