const net = require('net');

let HOST = '127.0.0.1';
let PORT = 40000;

let client = new net.Socket();
client.connect(PORT, HOST,()=>{
    console.log('Client connected: ', client.remoteAddress + ' ' + client.remotePort);
})

client.write('Message form client');
client.on('data',(data)=>{
    console.log('Message from server: ', data.toString());
    client.destroy();
})

client.on('close',()=>{
    console.log('Client close');
})

client.on('error',()=>{
    console.log('Client error');
})