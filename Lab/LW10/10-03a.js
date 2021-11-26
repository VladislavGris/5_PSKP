const WebSocket = require('ws');

let parm0 = process.argv[0];
let parm1 = process.argv[1];
let parm2 = process.argv[2];

console.log('parm2 ',parm2);

let prfx = typeof parm2 == 'undefined'?'A':parm2;
const socket = new WebSocket('ws://localhost:3000/broadcast');

socket.on('open', ()=>{
    let k = 0;
    setInterval(()=>{
        socket.send(`client ${prfx}-${++k}`);
    }, 3000);
        
    socket.on('message', (message)=>{
        console.log('Received message: ', message.toString('utf-8'));
    })
    setTimeout(()=>{
        socket.close();
    }, 25000);
})
