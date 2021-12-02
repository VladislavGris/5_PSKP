const rpcWSS = require('rpc-websockets').Server;

let server = new rpcWSS({port:4000, host:'localhost'});

server.event('A');
server.event('B');
server.event('C');

process.stdin.on('readable',()=>{
    let data = null;
    while((data = process.stdin.read())!=null){
        
        switch(data.toString('utf8').trim()){
            case "A":
                server.emit('A',{event:'A'});
                break;
            case "B":
                server.emit('B',{event:'B'});
                break;
            case "C":
                server.emit('C',{event:'C'});
                break;
            default:
                console.log('Incorrect input');
                break;
        }
    }
    
})