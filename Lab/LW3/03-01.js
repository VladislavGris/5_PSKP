var http = require('http')
var state = 'norm' // norm, stop, test, idle

http.createServer((request, response)=>{
    response.end("Hello");
}).listen(5000)
console.log('Server is running at localhost:5000')