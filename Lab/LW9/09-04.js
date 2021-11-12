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
            let body = JSON.parse(parms);
            response.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
            let jsonResponse = {};
            jsonResponse.__comment = 'Ответ.Лабораторная работа 9';
            jsonResponse.x_plus_y = body.x + body.y;
            jsonResponse.Concatenation_s_o = body.s + ' ' + body.o.surname + ' ' + body.o.name;
            jsonResponse.Length_m = body.m.length;
            response.end(JSON.stringify(jsonResponse));
        })       
    }
}).listen(5000, (v)=>{
    console.log('Server running at http://localhost:5000/')
});

let parms = JSON.stringify({
    "__comment": "Запрос.Лабораторная работа 9",
    "x": 1,
    "y": 2,
    "s": "Сообщение",
    "m": ["a", "b", "c"],
    "o":{"surname":"Иванов", "name": "Иван"}
});

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