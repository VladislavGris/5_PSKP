var http = require('http')
var state = 'norm' // norm, stop, test, idle

http.createServer((request, response)=>{
    response.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
    response.end('<h1>'+state+'</h1>');
}).listen(5000)
console.log('Server is running at localhost:5000')

process.stdout.write(state+'->');

process.stdin.setEncoding("utf-8");
process.stdin.on('readable',()=>{
    let chunk = null;
    while((chunk = process.stdin.read())!=null){
        if(chunk.trim()=='norm'){
            process.stdout.write('reg = '+state+' --> norm\n');
            state = 'norm';
        }else if(chunk.trim()=='stop'){
            process.stdout.write('reg = '+state+' --> stop\n');
            state = 'stop';
        }else if(chunk.trim()=='test'){
            process.stdout.write('reg = '+state+' --> test\n');
            state = 'test';
        }else if(chunk.trim()=='idle'){
            process.stdout.write('reg = '+state+' --> idle\n');
            state = 'idle';
        }else if(chunk.trim()=='exit'){
            process.exit(0);
        }
        process.stdout.write(state+'->');
    }
});