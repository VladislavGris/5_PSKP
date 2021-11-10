const http = require('http')
const url = require('url')
const fs = require('fs')
const qs = require('querystring')
const parseString = require('xml2js').parseString;
const xmlbuilder = require('xmlbuilder');
const mp = require('multiparty')

let GET_handler = (req, res) => {
    switch(url.parse(req.url).pathname.split('/')[1]){
        case 'connection':
            let set = url.parse(req.url, true).query.set;
            if(set){
                if(isNaN(Number(set))){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.end(`<h1>Error: set paramter is NaN</h1>`);
                    break;
                }
                server.keepAliveTimeout = parseInt(set);
            }
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h1>KeepAliveTimeout: ${server.keepAliveTimeout}</h1>`);
            break;
        case 'headers':
            res.setHeader('MyHeader', 'header');
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write(`<h2>${JSON.stringify(req.headers)}</h2>`);
            res.end(`<h2>${JSON.stringify(res.headers)}</h2><br>`)
            break;
        case 'parameter':
            if(url.parse(req.url).pathname.split('/').length > 2){
                if(RegExp(/^\/parameter\/[0-9]+\/[0-9]+/).test(url.parse(req.url).pathname)){
                    let x = Number(url.parse(req.url).pathname.split('/')[2]);
                    let y = Number(url.parse(req.url).pathname.split('/')[3]);
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    res.write(`<h1>x+y=${x+y}</h1>`);
                    res.write(`<h1>x-y=${x-y}</h1>`);
                    res.write(`<h1>x*y=${x*y}</h1>`);
                    res.end(`<h1>x/y=${x/y}</h1>`);
                    break;
                }
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end(`<h1>${req.url}</h1>`);
                break;
            }
            let x = url.parse(req.url, true).query.x;
            let y = url.parse(req.url, true).query.y;
            if(x && y && !isNaN(Number(x)) && !isNaN(Number(y))){
                let xNum = Number(x);
                let yNum = Number(y);
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write(`<h1>x+y=${xNum+yNum}</h1>`);
                res.write(`<h1>x-y=${xNum-yNum}</h1>`);
                res.write(`<h1>x*y=${xNum*yNum}</h1>`);
                res.end(`<h1>x/y=${xNum/yNum}</h1>`);
                break;
            }
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h1>x or y is NaN or undefined</h1>`);
            break;
        case 'close':
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h1>Сервер закрывается</h1>`);
            setTimeout(()=>{server.close()}, 10000);
            break;
        case 'socket':
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h2>localAddress: ${req.socket.localAddress}<br>localPort ${req.socket.localPort}<br>serverAddress ${JSON.stringify(server.address())}</h2>`);
            break;
        case 'req-data':
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            let buf = '';
            req.on('data', (data) => {
                console.log('data = ', data.toString('utf-8'));
                console.log('------------------------------------------------');
                console.log('requsent.on(data) = ', data.length);
                console.log('------------------------------------------------');
                buf += data;
            });
            req.on('end', () => {
                console.log('request.on(end) = ', buf.length)
            });
            res.end();
            break;
        case 'resp-status':
            let code = url.parse(req.url, true).query.code;
            let mess = url.parse(req.url, true).query.mess;
            if(code && mess){
                res.writeHead(code,mess, {'Content-Type': 'text/html; charset=utf-8'});
                res.end();
                break;
            }
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h1>code or mess is undefined</h1>`);
            break;
        case 'formparameter':
            let html = fs.readFileSync('index.html');
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(html);
            break;
        case 'files':
            if(url.parse(req.url).pathname.split('/').length > 2){
                try{
                    let filename = url.parse(req.url).pathname.split('/')[2];
                    let data = fs.readFileSync('static/' + filename);
                    res.end(data);
                }catch(e){
                    res.writeHead(404, {'Content-type': 'text/html'});
                    res.end('File not found');
                }
                break;
            }
            res.setHeader('X-static-files-count', fs.readdirSync('./static').length);
            res.end();
            break;
        case 'upload':
            let html1 = fs.readFileSync('file_form.html');
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(html1);
            break;
        default:
            break;
    }
}

let POST_handler = (req, res) => {
    switch(url.parse(req.url).pathname.split('/')[1]){
        case 'formparameter':
            let result = '';
            req.on('data', (data)=>{result+=data;});
            req.on('end', ()=>{
                result += '<br>';
                let o = qs.parse(result);
                for(let key in o){
                    result += `${key} = ${o[key]}<br>`;
                }
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write('<h1>Parameters</h1>')
                res.end(result);
            });
            break;
        case 'json':
            let data = '';
            req.on('data', (chunk) => { data += chunk; });
            req.on('end', () => {
                res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
                data = JSON.parse(data);
                let jsonResponse = {};
                jsonResponse.__comment = 'Ответ.Лабораторная работа 8/10';
                jsonResponse.x_plus_y = data.x + data.y;
                jsonResponse.Concatenation_s_o = data.s + ' ' + data.o.surname + ' ' + data.o.name;
                jsonResponse.Length_m = data.m.length;
                res.end(JSON.stringify(jsonResponse));
            });
            break;
        case 'xml':
            let data1 = '';
            req.on('data', (chunk) => { data1 += chunk; });
            req.on('end', () => {
                res.writeHead(200, {'Content-type': 'application/xml'});
                parseString(data1, function(err, result) {
                    let id = result.request.$.id;
                    let xSum = 0;
                    let mSum = '';
                    result.request.x.forEach((p) => {
                        xSum += parseInt(p.$.value);
                    });
                    result.request.m.forEach((p) => {
                        mSum += p.$.value;
                    });

                    let xmlDoc = xmlbuilder.create('response').att('id', ++respCount).att('request', id);
                    xmlDoc.ele('sum').att('element', 'x').att('result', xSum).up().ele('concat').att('element', 'm').att('result', mSum);

                    res.end(xmlDoc.toString());
                });
            });
            break;
        case 'upload':
            let form = new mp.Form({uploadDir: './static'});
            form.on('file', (name, file) => { });
            form.on('error', (err)=>{res.writeHead(200, {'Content-type': 'text/plain'}); res.end('Not uploaded!')});
            form.on('close', () => {
                res.writeHead(200, {'Content-type': 'text/plain'});
                res.end("Uploaded!");
            });
            form.parse(req);
            break;
        default:
            break;
    }
}

let http_handler = (req, res) => {
    switch(req.method){
        case 'GET':
            GET_handler(req, res);
            break;
        case 'POST':
            POST_handler(req, res);
            break;
        default:
            break;
    }
}
let respCount = 0;
let server = http.createServer();
let clientSocket = {};
server.listen(5000, (v)=>{console.log('Server running at http://localhost:5000/');})
.on('error', (e)=>{console.log('Server listen error: ', e.code)})
.on('request', http_handler);