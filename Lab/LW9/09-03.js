const http = require('http')
const url = require('url')
const query = require('querystring')

http.createServer((request, response)=>{
    if(request.method === 'POST'){
        let params = '';
        request.on('data', (chunk)=>{
            params+=chunk;
        })
        request.on('end',()=>{
            console.log('request end: ', params);
            let [x, y, s] = params.split('&');
            if(x && y && s){
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.end(`<h1>x:${x} y:${y} s:${s}</h1>`); 
                return;
            }
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.end(`<h1>No params</h1>`);
        })       
    }
}).listen(5000, (v)=>{
    console.log('Server running at http://localhost:5000/')
});

let parms = query.stringify({x:1, y:2, s:'string'});

let options = {
    host:'localhost',
    path:'/',
    port: 5000,
    method:'POST'
}

console.log('parms: ', parms);

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

req.write(parms);
req.end();