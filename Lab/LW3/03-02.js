const http = require('http');
const url = require('url');

const url_base = 'http://localhost:5000';

function factorial(num){
    return (num === 0 ? 1 : factorial(num-1) * num);
}

http.createServer((req,resp)=>{
    let rc = JSON.stringify({k:0});

    if(url.parse(req.url).pathname === '/fact'){
        if(typeof url.parse(req.url,true).query.k != 'undefined'){
            let k = parseInt(url.parse(req.url,true).query.k);
            if(Number.isInteger(k)){
                resp.writeHead(200, {'Content-Type':'application/json;charset=utf-8'});
                resp.end(JSON.stringify({k:k, fact:factorial(k)}));
            }
        }
    }else{
        resp.end(rc);
    }
    
}).listen(5000);
console.log('Server is running on http://localhost:5000')