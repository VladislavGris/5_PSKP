const http = require('http');
const websock = require('ws');
const url = require('url');

let server = http.createServer((req, res)=>{
    if(url.parse(req.url).pathname === '/start' && req.method === 'GET'){
        res.writeHead(400,{'Content-Type':'text/html; charset=utf-8'});
        res.end(require('fs').readFileSync('./index.html'));
    }else{
        res.writeHead(400,{'Content-Type':'text/html; charset=utf-8'});
        res.end('<h1>Wrong request</h1>');
    }
}).listen(3000, (v)=>{
    console.log('Server running at http://localhost:3000/');
})
let k = 0;
let clientNum = 0;
let webserver = new websock.Server({port:4000, host:'localhost', path:"/wsserver"});
webserver.on('connection', (ws)=>{
    ws.on('message', (message)=>{
        console.log('Messsage: ', message.toString('utf-8'));
        clientNum = message;
    });
    setInterval(()=>{ws.send(`10-01-server: ${clientNum}->${++k}`)},5000);
})
webserver.on('error', (e)=>{console.log('WS server error: ' + e.message)});
console.log('WS server port:4000, host:localhost, path:/wsserver');