const http = require('http');
const url = require('url')
const fs = require('fs')
const db = require('./db')

var database = new db.DB();
var stop_timer;
var commit_interval;
var statistics_timer;
var get_statistics = false;
var statistics = {start:null, finish:null, request:null, commit:null};


database.on('COMMIT', ()=>{
    console.log('Commit')
    database.commit();
    if(get_statistics){
        statistics.commit+=1;
    }
});

database.on('GET',(request, response)=>{
    if(typeof url.parse(request.url,true).query.id != 'undefined'){
        let id = parseInt(url.parse(request.url,true).query.id);
        if(Number.isInteger(id)){
            response.writeHead(200, {'Content-Type':'application/json; charset=utf8'});
            response.end(JSON.stringify(database.get_by_id(id)));
        }
    }else{
        response.writeHead(200, {'Content-Type':'application/json; charset=utf8'});
        response.end(JSON.stringify(database.select()));
    }
    
});

database.on('POST',(request, response)=>{
    let data = '';
    request.on('data', chunck =>{
        data+=chunck;
    })
    request.on('end',()=>{
        let row = JSON.parse(data);
        database.insert(row);
        response.writeHead(200, {'Content-Type':'application/json; charset=utf8'});
        response.end(JSON.stringify(database.select()));
    });
});

database.on('PUT',(request, response)=>{
    let data = '';
    request.on('data', chunck =>{
        data+=chunck;
    })
    request.on('end',()=>{
        let row = JSON.parse(data);
        database.update(row);
        response.writeHead(200, {'Content-Type':'application/json; charset=utf8'});
        response.end(JSON.stringify(database.select()));
    });
});

database.on('DELETE',(request, response)=>{
    if(typeof url.parse(request.url,true).query.id != 'undefined'){
        let id = parseInt(url.parse(request.url,true).query.id);
        if(Number.isInteger(id)){
            response.writeHead(200, {'Content-Type':'application/json; charset=utf8'});
            response.end(JSON.stringify(database.delete(id)));
        }
    }
});

var server = http.createServer((request, response)=>{
    if(get_statistics){
        statistics.request+=1;
    }
    if(url.parse(request.url).pathname === '/api/db'){
        database.emit(request.method, request, response);
    }
    if(url.parse(request.url).pathname === '/'){
        let page = fs.readFileSync('./index.html');
        response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        response.end(page);
    }
    if(url.parse(request.url).pathname === '/api/ss'){
        response.writeHead(200, {'Content-Type' : 'application/json'});
        response.end(JSON.stringify(statistics));
    }
}).listen(5000);
console.log('Server is running at localhost:5000');

process.stdin.unref();
process.stdin.on('readable',()=>{
    let chunk = null;
    while((chunk = process.stdin.read())!=null){
        let [command, sec] = chunk.toString('utf8').trim().split(' ');
        if(command){
            switch(command){
                case 'sd':
                    if(sec){
                        if(parseInt(sec) != NaN){
                            clearTimeout(stop_timer);
                                stop_timer = setTimeout(()=>{
                                server.close(()=>{console.log('server closed')});
                            },sec*1000);
                        }
                    }else{
                        clearTimeout(stop_timer);
                    }
                    break;
                case 'sc':
                    if(sec){
                        if(parseInt(sec) != NaN){
                            commit_interval = setInterval(()=>{
                                database.emit('COMMIT');
                            },sec*1000);
                            commit_interval.unref();
                        }
                    }else{
                        clearInterval(commit_interval);
                    }
                    break;
                case 'ss':
                    if(sec){
                        if(parseInt(sec) != NaN){
                            statistics = {start:new Date(), finish:null, request:0, commit:0}
                            get_statistics = true;
                            statistics_timer = setTimeout(()=>{
                                get_statistics = false;
                                statistics.finish = new Date();
                                console.log('Statistics completed');
                            },sec*1000);
                            statistics_timer.unref();
                        }
                    }else{
                        clearTimeout(statistics_timer);
                    }
                    break;

            }
        }
    }
});