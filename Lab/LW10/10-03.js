const WebSocket = require('ws');

const socket = new WebSocket.Server({port:3000, host:'localhost', path:'/broadcast'});

socket.on('connection', (ws)=>{
    ws.on('message', (data)=>{
        console.log(data.toString('utf-8'));
        socket.clients.forEach((client)=>{
            if(client.readyState === WebSocket.OPEN){
                client.send(`server: ${data}`);
            }
        })
    })
})