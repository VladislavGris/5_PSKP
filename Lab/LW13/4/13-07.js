const net = require('net');

let HOST = '0.0.0.0';
let PORT1 = 40000;
let PORT2 = 50000;

let handler = (port)=>{
    return (sock)=>{
        console.log(`Connected${port}: ${sock.remoteAddress}:${sock.remotePort}`);
        sock.on('data',(data)=>{
            console.log(`Data${port}: ${sock.remoteAddress}:${sock.remotePort}`);
            sock.write(`ECHO: ${data.readInt32LE().toString()}`);
        })
        sock.on('close',(data)=>{
            console.log(`Closed${port}: ${sock.remoteAddress}:${sock.remotePort}`);
        })
    }
}

net.createServer(handler(PORT1)).listen(PORT1,HOST).on('listening',()=>{
    console.log(`TCP-server: ${HOST}:${PORT1}`);
});
net.createServer(handler(PORT2)).listen(PORT2,HOST).on('listening',()=>{
    console.log(`TCP-server: ${HOST}:${PORT2}`);
})