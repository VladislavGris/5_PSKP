const http = require('http')
const fs = require('fs');

http.createServer((request, response)=>{
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    let readStream = fs.createReadStream('MyFile.txt');
    readStream.on('end', () => {
        response.end();
    });
    readStream.pipe(response);
    
}).listen(5000, (v)=>{
    console.log('Server running at http://localhost:5000/')
});

const file = fs.createWriteStream("file.txt");

let options = {
    host:'localhost',
    path:'/',
    port: 5000,
    method:'GET'
}

let req = http.request(options, (res)=>{
    res.pipe(file);
});

req.on('error', (e)=>{
    console.log('error: ',e.message);
})
req.end();