const net = require('net');

let HOST = '0.0.0.0';
let PORT = 40000;

let sum = 0;
let connections = new Map();
let server = net.createServer();

server.on('connection',(sock)=>{
    //let sum = 0;
    sock.id = (new Date()).toISOString();
    connections.set(sock.id, 0);
    console.log('Server connected: ',sock.remoteAddress,' ', sock.remotePort);

    sock.on('data',(data)=>{
        console.log('Server data: ',data, connections.get(sock.id));
        sum = data.readInt32LE() + connections.get(sock.id);
        connections.set(sock.id, sum);
        sum =0;
    })

    let buf = Buffer.alloc(4);

    setInterval(()=>{
        buf.writeInt32LE(connections.get(sock.id),0);
        sock.write(buf)
    },5000);

    sock.on('close',(data)=>{
        console.log('Server closed: ', sock.remoteAddress,' ',sock.remotePort);
    })

    sock.on('error',(e)=>{
        console.log('Server error: ',sock.remoteAddress,' ', sock.remotePort);
    })
})

server.on('listening',()=>{
    console.log('TCP-server');
})
server.on('error',(e)=>{
    console.log('TCP-server error ',e);
})
server.listen(PORT,HOST);