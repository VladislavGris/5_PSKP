const rpcWSC = WebSocket = require('rpc-websockets').Client;
const async = require('async');
let ws = new rpcWSC('ws://localhost:4000');

let h = ()=>async.waterfall([
    (cb)=>{
        ws.call('square',[3]).catch((e)=>{cb(e,null)}).then((r)=>{console.log(`sqare(3) = ${r}`);cb(null,r)});
    },
    (sqare3,cb)=>{
        ws.call('square',[5,4]).catch((e)=>{cb(e,null)}).then((r)=>{console.log(`sqare(5,4) = ${r}`);cb(null, sqare3,r)});
    },
    (sqare3, sqare54,cb)=>{
        ws.call('mul',[3,5,7,9,11,13]).catch((e)=>{cb(e,null)}).then((r)=>{console.log(`mul(3,5,7,9,11,13) = ${r}`);cb(null, sqare3, sqare54, r)})
    },
    (sqare3, sqare54, mul, cb)=>{
        ws.call('sum',[sqare3,sqare54, mul]).catch((e)=>{cb(e,null)}).then((r)=>{console.log(`sum(sqare(3),sqare(5,4),mul(3,5,7,9,11,13)) = ${r}`); cb(null, r)});
    },
    (sum, cb)=>{
        ws.login({login:'gva',password:'1234'}).then((login)=>{
            if(login){
                ws.call('fib',[7]).catch((e)=>{cb(e,null)}).then((r)=>{console.log(`fib(7) = ${r}`);console.log(`max(fib(7)) = ${Math.max.apply(null,r)}`);cb(null, sum, Math.max.apply(null,r))});
            }else{
                console.log('Login error');
            }
        })
    },
    (sum, fib, cb)=>{
        ws.login({login:'gva',password:'1234'}).then((login)=>{
            if(login){
                ws.call('mul',[2,4,6]).catch((e)=>{cb(e,null)}).then((r)=>{console.log(`mul(2,4,6) = ${r}`);cb(null, sum, fib, r)});
            }else{
                console.log('Login error');
            }
        })
    },
    (sum, fib, mulEven, cb)=>{
        ws.call('mul',[fib,mulEven]).catch((e)=>{cb(e,null)}).then((r)=>{
            console.log(`mul(fib(7),mul(2,4,6)) = ${r}`); 
            cb(null,sum, r);
        });
    },
    (sum, mulfm, cb)=>{
        ws.call('sum',[sum,mulfm]).catch((e)=>{cb(e,null)}).then((r)=>{
            console.log('Final result: ',r);
            cb(null,r);
        })
    }
],(e,r)=>{
    if(e) console.log('e = ',e);
    else console.log('r = ',r);
    ws.close();
})

ws.on('open', h);