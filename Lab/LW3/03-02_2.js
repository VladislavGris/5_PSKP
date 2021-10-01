const http = require('http');
const url = require('url');
const fs = require('fs');
const url_base = 'http://localhost:5000';
var fact = (k)=>{return (k === 0 ? 1 : fact(k-1) * k); };

http.createServer((req,resp)=>{
    let rc = JSON.stringify({k:0});

    if(url.parse(req.url).pathname === '/fact'){
        if(typeof url.parse(req.url,true).query.k != 'undefined'){
            let k = parseInt(url.parse(req.url,true).query.k);
            if(Number.isInteger(k)){
                resp.writeHead(200, {'Content-Type':'application/json;charset=utf-8'});
                resp.end(JSON.stringify({k:k, fact:fact(k)}));
            }
        }
    }else if(url.parse(req.url).pathname === '/'){
        let f = fs.readFileSync('./03-03.html');
        resp.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
        resp.end(f);
    }else{
        resp.end(rc);
    }
    
}).listen(5000);
console.log('Server is running on http://localhost:5000')