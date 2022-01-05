let udp = require('dgram');
const PORT = 3000;

let server = udp.createSocket('udp4');

server.on('error',(err)=>{
    console.log('Error: ' + err);
    server.close();
})

server.on('message',(msg,info)=>{
    console.log('Message from client: ' + msg.toString());
    console.log(`Message info length ${msg.length} address ${info.address} port ${info.port}`);

    let clientMessage = 'ECHO:'+msg;
    server.send(clientMessage, info.port, info.address,(err)=>{
        if(err) server.close();
        else console.log('Server send data to client');
    })
})

server.on('listening',()=>{
    console.log('Server is running');
})

server.on('close',()=>{
    console.log('Server socket close');
})

server.bind(PORT);