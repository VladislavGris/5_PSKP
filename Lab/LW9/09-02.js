const http = require('http')
const url = require('url')
const query = require('querystring')

http.createServer((request, response)=>{
    if(request.method === 'GET'){
        let x = url.parse(request.url, true).query.x;
        let y = url.parse(request.url, true).query.y;
        if(x && y){
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.end(`<h1>x:${x} y:${y}</h1>`);
            return;
        }
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(`<h1>No params</h1>`);
    }
}).listen(5000, (v)=>{
    console.log('Server running at http://localhost:5000/')
});

let parms = query.stringify({x:1, y:2});
let path = `/?${parms}`;

let options = {
    host:'localhost',
    path:path,
    port: 5000,
    method:'GET'
}

console.log('parms: ', parms);
console.log('path: ',path);

const req = http.request(options, (res)=>{
    console.log('status code: ', res.statusCode);
    let data = '';
    res.on('data',(chunk)=>{
        data+=chunk.toString('utf-8');
    })
    res.on('end', ()=>{
        console.log('data: ', data);
    })
    
})
req.on('error',(e)=>{
    console.log('request error:', e.message);
});
req.end();