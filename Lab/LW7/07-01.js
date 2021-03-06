const http = require('http')
const stat = require('./m07-01')('./static')

let server = http.createServer();

let GET_handler = (req, res) => {
    if(stat.isStatic('html',req.url)){
        stat.sendFile(req, res, {'Content-Type':'text/html; charset=utf-8'});
    }else if(stat.isStatic('css', req.url)){
        stat.sendFile(req, res, {'Content-Type':'text/css; charset=utf-8'});
    }else if(stat.isStatic('js', req.url)){
        stat.sendFile(req, res, {'Content-Type':'text/javascript; charset=utf-8'});
    }else if(stat.isStatic('png', req.url)){
        stat.sendFile(req, res, {'Content-Type':'image/png; charset=utf-8'});
    }else if(stat.isStatic('docx', req.url)){
        stat.sendFile(req, res, {'Content-Type':'application/msword; charset=utf-8'});
    }else if(stat.isStatic('json', req.url)){
        stat.sendFile(req, res, {'Content-Type':'application/json; charset=utf-8'});
    }else if(stat.isStatic('xml', req.url)){
        stat.sendFile(req, res, {'Content-Type':'application/xml; charset=utf-8'});
    }else if(stat.isStatic('mp4', req.url)){
        stat.sendFile(req, res, {'Content-Type':'video/mp4; charset=utf-8'});
    }else{
        stat.writeHTTP404(res);
    }

}

let http_handler = (req, res) => {
    switch(req.method){
        case 'GET':
            GET_handler(req, res);
            break;
        default:
            stat.writeHTTP405(res);
            break;
    }
}

server.listen(5000, (v)=>{console.log('Server running at http://localhost:5000/');})
.on('error', (e)=>{console.log('Server listen error: ', e.code)})
.on('request', http_handler);