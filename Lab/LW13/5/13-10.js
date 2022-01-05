const buffer = require('buffer');
const { info } = require('console');
const udp = require('dgram');
const client = udp.createSocket('udp4');
const PORT = 3000;

client.on('message',(msg,info)=>{
    console.log('Message form server: ' + msg.toString());
})

let data = Buffer.from('Client message');
client.send(data, PORT, 'localhost',(err)=>{
    if(err) client.close();
    else console.log('Client send data to server');
})