const http = require('http')

http.createServer((request, response)=>{
    if(request.method === 'GET'){
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end('<h1>Response</h1>');
    }
}).listen(5000, (v)=>{
    console.log('Server running at http://localhost:5000/')
});

let options = {
    host:'localhost',
    path:'/',
    port: 5000,
    method:'GET'
}

const req = http.request(options, (res)=>{
    console.log('method: ', req.method);
    console.log('resp status code: ', res.statusCode);
    console.log('resp status msg: ', res.statusMessage);
    console.log('server ip: ', res.socket.remoteAddress);
    console.log('server port: ', res.socket.remotePort);
    
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
})
req.end();