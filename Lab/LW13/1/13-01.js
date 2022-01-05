const net = require('net');

let HOST = '0.0.0.0';
let PORT = 40000;

net.createServer((sock)=>{
    console.log('Server connected: ' + sock.remoteAddress + ':' + sock.remotePort);

    sock.on('data',(data)=>{
        console.log('Server on data: ',sock.remoteAddress + ':' + data);
        sock.write('ECHO:' + data);
    })

    sock.on('close',()=>{
        console.log('Server closed: ' + sock.remoteAddress + ':' + sock.remotePort);
    })
}).listen(PORT, HOST);

console.log('TCP server: ' + HOST + ':' + PORT);