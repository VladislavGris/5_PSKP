const async = require('async');
const rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000');

// ws.on('open',()=>{
//     ws.call('square', [3]).then((r)=>{console.log(`square(3) = ${r}`)});
//     ws.call('square', [5,4]).then((r)=>{console.log(`square(5,4) = ${r}`)});
//     ws.call('sum', [2]).then((r)=>{console.log(`sum(2) = ${r}`)});
//     ws.call('sum', [2,4,6,8,10]).then((r)=>{console.log(`sum(2,4,6,8,10) = ${r}`)});
//     ws.call('mul', [3]).then((r)=>{console.log(`nul(3) = ${r}`)});
//     ws.call('mul', [3,5,7,9,11,13]).then((r)=>{console.log(`Sum(3,5,7,9,11,13) = ${r}`)});

//     ws.login({login:'gva', password: '1234'}).then((login)=>{
//         if(login){
//             ws.call('fib',[1]).then((r)=>{console.log(`fib(1) = ${r}`)});
//             ws.call('fib',[2]).then((r)=>{console.log(`fib(2) = ${r}`)});
//             ws.call('fib',[7]).then((r)=>{console.log(`fib(7) = ${r}`)});
//             ws.call('fact',[0]).then((r)=>{console.log(`fact(0) = ${r}`)});
//             ws.call('fact',[5]).then((r)=>{console.log(`fact(5) = ${r}`)});
//             ws.call('fact',[10]).then((r)=>{console.log(`fact(10) = ${r}`)});
//             return;
//         }
//         console.log('Login error');
//     })
// })

let h = (x=ws)=>async.parallel({
    squire3: (cb)=>{
        ws.call('square', [3]).catch((e)=>{cb(e,null)}).then((r)=>{cb(null,r)})
    },
    squire3: (cb)=>{
        ws.call('square', [5,4]).catch((e)=>{cb(e,null)}).then((r)=>{cb(null,r)})
    },
    sum1: (cb)=>{
        ws.call('sum', [2]).catch((e)=>{cb(e,null)}).then((r)=>{cb(null,r)});
    },
    sum2: (cb)=>{
        ws.call('sum', [2,4,6,8,10]).catch((e)=>{cb(e,null)}).then((r)=>{cb(null,r)}); 
    },
    mul1:(cb)=>{
        ws.call('mul', [3]).catch((e)=>{cb(e,null)}).then((r)=>{cb(null, r)});
    },
    mul2:(cb)=>{
        ws.call('mul', [3,5,7,9,11,13]).catch((e)=>{cb(e,null)}).then((r)=>{cb(null,r)});
    },
    fib1:(cb)=>{
        ws.login({login:'gva', password: '1234'}).then((login)=>{
            if(login){
                ws.call('fib',[1]).catch((e)=>{cb(e,null)}).then((r)=>{cb(null,r)});
            }else{
                console.log('Login Error');
            }
            
        })
    },
    fib2:(cb)=>{
        ws.login({login:'gva', password: '1234'}).then((login)=>{
            if(login){
                ws.call('fib',[2]).catch((e)=>{cb(e,null)}).then((r)=>{cb(null,r)});
            }else{
                console.log('Login Error');
            }
        })
    },
    fib3:(cb)=>{
        ws.login({login:'gva', password: '1234'}).then((login)=>{
            if(login){
                ws.call('fib',[7]).catch((e)=>{cb(e,null)}).then((r)=>{cb(null,r)});
            }else{
                console.log('Login Error');
            }
        })
    },
    fact1:(cb)=>{
        ws.login({login:'gva',password:'1234'}).then((login)=>{
            if(login){
                ws.call('fact',[0]).catch((e)=>{cb(e,null)}).then((r)=>{cb(null,r)});
            }else{
                console.log('Login Error');
            }
        })
    },
    fact2:(cb)=>{
        ws.login({login:'gva',password:'1234'}).then((login)=>{
            if(login){
                ws.call('fact',[5]).catch((e)=>{cb(e,null)}).then((r)=>{cb(null, r)});            }else{
                console.log('Login Error');
            }
        })
    },
    fact3:(cb)=>{
        ws.login({login:'gva',password:'1234'}).then((login)=>{
            if(login){
                ws.call('fact',[10]).catch((e)=>{cb(e,null)}).then((r)=>{cb(null,r)});
            }else{
                console.log('Login Error');
            }
        })
    }
}, (e,r)=>{
    if(e)
        console.log('e = ',e);
    else
        console.log('r = ',r);
});

ws.on('open',h);