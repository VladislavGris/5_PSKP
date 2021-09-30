var http = require('http');
var fs = require('fs');
// URLs
const homeUrl = '/home';
const htmlUrl = '/html';
const picUrl = '/png';
const apiNameUrl = '/api/name';
const xmlHttpRequestUrl = '/xmlhttprequest';
const fetchUrl = '/fetch';
const jqueryUrl = '/jquery';
//Filenames
const homePageName = './home.html';
const pageName = './index.html';
const picName = './pic.png';
const reqPageName = './xmlhttprequest.html';
const fetchPageName = './fetch.html';
const jqueryPageName = './jquery.html';

const name = 'Гришкевич Владислав Алексеевич';

http.createServer(function(request, response){
    switch(request.url){
        case homeUrl:
            sendHTMLPage(response, fs, homePageName);
            break;
        case htmlUrl:
            sendHTMLPage(response, fs, pageName);
            break;
        case picUrl:
            fs.stat(picName, (err, stat)=>{
                if(err){
                    console.log("error: ", err);
                }else{
                    var pic = fs.readFileSync(picName);
                    response.writeHead(200, {'Content-Type':'image/png;','Content-Length':stat.size});
                    response.end(pic,'binary');
                }
            });
            break;
        case apiNameUrl:
            response.writeHead(200, {'Content-Type':'text/plian; charset=utf8'});
            response.end(name);
            break;
        case xmlHttpRequestUrl:
            sendHTMLPage(response, fs, reqPageName);
            break;
        case fetchUrl:
            sendHTMLPage(response, fs, fetchPageName);
            break;
        case jqueryUrl:
            sendHTMLPage(response, fs, jqueryPageName);
            break;
        default:
            response.writeHead(200, {'Content-Type':'text/plian; charset=utf8'});
            response.end('Content not found');
            break;
    }
}).listen(5000)

console.log("Server is running at http://localhost:3000");

function sendHTMLPage(response, fs, name){
    let html = fs.readFileSync(name);
    response.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
    response.end(html);
}