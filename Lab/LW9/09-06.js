const http = require('http')
const fs = require('fs');

http.createServer((request, response)=>{
    if(request.method === 'POST'){
        let params = '';
        request.on('data', (chunk)=>{
            params+=chunk;
        })
        request.on('end',()=>{
            console.log('request end: ', params);
            response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
            response.end(params); 
        })
              
    }
}).listen(5000, (v)=>{
    console.log('Server running at http://localhost:5000/')
});

let bound = '----12341234';
let body = `--${bound}\r\n`;
    body += 'Content-Disposition: form-data; name="file"; filename="MyFile.txt"\r\n';
    body += 'Content-Type: text/plain\r\n\r\n';
    body += fs.readFileSync('MyFile.txt');
    body += `\r\n${bound}\r\n`;

let options = {
    host:'localhost',
    path:'/',
    port: 5000,
    method:'POST',
    headers:{'content-type':'multipart/form-data; boundary='+bound}
}

const req = http.request(options, (res)=>{
    console.log('status code: ', res.statusCode);
    let data = '';
    res.on('data',(chunk)=>{
        data+=chunk;
    })
    res.on('end', ()=>{
        // console.log('data: ', data.toString('utf-8'));
        console.log('body length: ', Buffer.byteLength(data));
    })
    
})
req.on('error',(e)=>{
    console.log('request error:', e.message);
});

req.end(body);