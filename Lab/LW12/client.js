const rpcWSC = WebSocket = require('rpc-websockets').Client;

let ws = new rpcWSC('ws://localhost:4000');

ws.on('open',()=>{
    ws.subscribe('Error');
    ws.subscribe('File changed');

    ws.on('Error',(p)=>{
        console.log('Error: ',p);
    })
    ws.on('File changed',(p)=>{
        console.log('File changed: ',p);
    })

    ws.on('message', (m)=>{
        console.log('Messge: ', m);
    })
})