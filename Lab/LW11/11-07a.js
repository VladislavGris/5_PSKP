const rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000');

process.stdin.on('readable',()=>{
    let data = null;
    while((data = process.stdin.read())!=null){
        
        switch(data.toString('utf8').trim()){
            case "n1":
                ws.notify('notify1',{notification:1});
                break;
            case "n2":
                ws.notify('notify1',{notification:2});
                break;
            default:
                console.log('Incorrect input');
                break;
        }
    }
    
})