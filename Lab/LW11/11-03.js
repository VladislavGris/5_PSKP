const WebSocket = require('ws');

const socket = new WebSocket.Server({port:4000, host:'localhost', path:'/pingpong'});
let n = 0;
const message_base = '11-03-server: ';
setInterval(()=>{
    n+=1;
    socket.clients.forEach((client)=>{
        if(client.readyState === WebSocket.OPEN){
            client.send(message_base+n);
        }
    })
    console.log(`Message №${n} sent`);
}, 15000);
let active_connections = 0;
setInterval(()=>{
    console.log(`Last connection check result: ${active_connections}`);
    active_connections = 0;
    console.log('Connection check started');
    socket.clients.forEach((client)=>{
        client.ping();
        client.on('pong',()=>{
            active_connections++;
        })
    })
},5000);
console.log('Server start');