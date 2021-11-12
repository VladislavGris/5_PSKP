const http = require('http')
const url = require('url')
const query = require('querystring')
const xmlbuilder = require('xmlbuilder');
const parseString = require('xml2js').parseString;

http.createServer((request, response)=>{
    if(request.method === 'POST'){
        let params = '';
        request.on('data', (chunk)=>{
            params+=chunk;
        })
        request.on('end',()=>{
            console.log('request end: ', params);
            response.writeHead(200, {'Content-type': 'application/xml'});
            parseString(params, function(err, result) {
                let id = result.request.$.id;
                let xSum = 0;
                let mSum = '';
                result.request.x.forEach((p) => {
                    xSum += parseInt(p.$.value);
                });
                result.request.m.forEach((p) => {
                    mSum += p.$.value;
                });
                let xmlDoc = xmlbuilder.create('response').att('request', id);
                xmlDoc.ele('sum').att('element', 'x').att('result', xSum).up().ele('concat').att('element', 'm').att('result', mSum);
                response.end(xmlDoc.toString());
            });
        })       
    }
}).listen(5000, (v)=>{
    console.log('Server running at http://localhost:5000/')
});

let parms = '<request id="28"><x value = "1"/><x value = "2"/><m value = "a"/><m value = "b"/><m value = "c"/></request>';

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