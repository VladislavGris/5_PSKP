const nodemailer = require("nodemailer");
const http = require('http');
const fs = require('fs');
const url = require('url');

async function send(parm){
    let transporter;
    let info;
    try{
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: parm.email,
                pass: parm.pass,
            },
    });
    }catch(e){
        console.log("transport error")
        return 'Error';
    }
    try{
        info = await transporter.sendMail({
            from: parm.login,
            to: parm.to,
            subject: parm.subject,
            text: parm.msg,
            // html: "<b>Test nodemailer</b>",
        });
        if(info.accepted){
            return 'Success';
        }else{
            return 'Fail';
        }
    }catch(e){
        console.log("message error" + e);
        return 'Login or password not accepted';
    }  
}

let http_handler = function (request, response){
    
    if(url.parse(request.url).pathname === '/' && request.method === 'GET') {
        fs.readFile('./06-02.html', (err, data) => {
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(data);
        });
    }
    if (url.parse(request.url).pathname === '/' && request.method === 'POST') {
        let body = '';
        request.on('data', (chunk) => { body += chunk.toString(); });
        request.on('end', () => {
            let parm = JSON.parse(body);
            send(parm).then((status)=>{
                response.writeHead(200, {'Content-Type':'text/plian; charset=utf8'});
                response.write(status)
                response.end();
            });
        });
    }
}


http.createServer(http_handler).listen(5000);

console.log('Server running at http://localhost:5000/');