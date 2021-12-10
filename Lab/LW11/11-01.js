const WebSocket = require('ws');
const fs = require('fs');
const http = require('http');
const url = require('url');
const qs = require('querystring')

let server = http.createServer((req,resp)=>{
    if(url.parse(req.url).pathname === '/client' && req.method === 'GET'){
        resp.writeHead(400,{'Content-Type':'text/html; charset=utf-8'});
        resp.end(fs.readFileSync('./11-01a.html'));
    }
    if(url.parse(req.url).pathname === '/upload' && req.method === 'POST'){
        const websock = new WebSocket('ws://localhost:4000');
        websock.on('open',()=>{
            let result = '';
            req.on('data',(chunk)=>{
                result+=chunk;
            })
            req.on('end',()=>{
                var parm = qs.parse(result);
                console.log('open');
                const duplex = WebSocket.createWebSocketStream(websock, {encoding: 'utf-8'});
                let rfile = fs.createReadStream(`./${parm['file']}`);
                rfile.pipe(duplex);
                resp.writeHead(400,{'Content-Type':'text/html; charset=utf-8'});
                resp.end('<h1>File uploaded</h1>');
            })
            
        })
    }
}).listen(5000,(v)=>{
    console.log('Server running at http://localhost:5000/');
});

let count = 0;
let webserver = new WebSocket.Server({
                                    port:4000, 
                                    host:'localhost', 
                                    path:'/'});
webserver.on('connection', (ws)=>{
    const duplex = WebSocket.createWebSocketStream(ws, {encoding:'utf-8'});
    let wfile = fs.createWriteStream(`./upload/file${count++}.txt`);
    duplex.pipe(wfile);
})