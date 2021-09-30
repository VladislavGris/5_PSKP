let http = require('http');

http.createServer(async (req, res) => {
    var buffers = [];
    for await (var chunk of req) {
      buffers.push(chunk);
    }
    var data = Buffer.concat(buffers).toString();
    
    res.writeHead(200,{'Content-Type':"text/html"});
    let reqInfo = '<div>Method: '+req.method+'</div><div>Protocol Version:'+req.httpVersion+'</div>'+'<div>Url: '+req.url+'</div>'+'<div>Headers: '+req.rawHeaders+'</div>'+'<div>Body: '+data+'</div>';
    res.write('<html><head></head><body>' + reqInfo +'</body></html>');
    res.end();
  }).listen(8080);

console.log("Server is running");