const http = require('http')
const fs = require('fs');

http.createServer((request, response)=>{
    let img = '';
    request.on('data', (chunk)=>{
        img+=chunk;
        //console.log(chunk.toString('utf-8'));
        //console.log('---------------------------------------------\n\n\n');
    })
    request.on('end', ()=>{
        //console.log(img.toString('utf-8'));
        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end(img.toString('utf-8')); 
    })
    
}).listen(5000, (v)=>{
    console.log('Server running at http://localhost:5000/')
});

let bound = '----12341234';
let body = `--${bound}\r\n`;
    body += 'Content-Disposition: form-data; name="file"; filename="image.png"\r\n';
    body += 'Content-Type: application/octet-stream\r\n\r\n';

let options = {
    host:'localhost',
    path:'/',
    port: 5000,
    method:'POST',
    headers:{'content-type':'multipart/form-data; boundary='+bound}
}

let req = http.request(options, (res)=>{
    let data = '';
    res.on('data', (chunk)=>{
        data+=chunk;
    });
    res.on('end', ()=>{
        console.log('body length: ', Buffer.byteLength(data));
    });
});

req.on('error', (e)=>{
    console.log('error: ',e.message);
})
req.write(body);

let stream = new fs.ReadStream('G:\\5_Sem\\ПСКП\\Lab\\LW9\\image.png');
stream.on('data', (chunk)=>{
    req.write(chunk);
    console.log('stream chunk length: ' + Buffer.byteLength(chunk));
})
stream.on('end', ()=>{
    req.end(`\r\n${bound}\r\n`);
})