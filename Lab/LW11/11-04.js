const WebSocket = require('ws');

const socket = new WebSocket.Server({port:4000, host:'localhost', path:'/json'});
let message_num = 0;


socket.on('connection',(ws)=>{
    console.log('New client connected');
    ws.on('message',(mes)=>{
        console.log(`Message form client: ${mes}`);
        let message_obj = JSON.parse(mes);
        let server_message =    {server:++message_num, 
                                client:message_obj.client, 
                                timestamp:Date.now()};
        ws.send(JSON.stringify(server_message));
    })
})

console.log('Server start');