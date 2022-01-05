const net = require('net');

let HOST = '127.0.0.1';
let PORT = 40000;

let client = new net.Socket();
let buf = new Buffer.alloc(4);
let timer = null;

client.connect(PORT, HOST, ()=>{
    console.log('Client connected: ',client.remoteAddress, ' ',client.remotePort);

    let k = 0;
    timer = setInterval(() => {
        client.write((buf.writeInt32LE(k++,0),buf))
    }, 1000);
    setTimeout(()=>{
        clearInterval(timer);
        //client.end();
        client.destroy();
    },20000)
})

client.on('data',(data)=>{
    console.log('SUM=',data.readInt32LE());
})

client.on('close',()=>{
    console.log('Client close');
})

client.on('error',(e)=>{
    console.log('Client error: ',e);
})