const rpcWSS = require('rpc-websockets').Server
var fact = (k)=>{return (k === 0 ? 1 : fact(k-1) * k); };
let server = new rpcWSS({port:4000, host:'localhost'});

server.setAuth((l)=>{return (l.login == 'gva' && l.password == '1234')});

server.register('square',(params)=>{
    switch(params.length){
        case 1:
            if(!isNaN(Number(params[0])))
                return Math.PI*Math.pow(params[0],2);
            return 'Incorrect parameter value. Expected: number';
        case 2:
            if(!isNaN(Number(params[0])) && !isNaN(Number(params[1])))
                return params[0]*params[1];
            return 'Incorrect parameter values. Expected: number, number';
        default:
            return 'Wrong number of parameters';
    }
}).public();
server.register('sum',(params)=>{
    let sum = 0;
    params.every(element => {
        if(isNaN(Number(element))){
            sum = 'Error';
            return false;
        }
        sum+=Number(element);
        return true;
    });
    if(sum == 'Error')
        return 'All parameters must be numbers';
    return sum;
}).public();
server.register('mul',(params)=>{
    let mul = 1;
    params.every(element => {
        if(isNaN(Number(element))){
            mul = 'Error';
            return false;
        }
        mul*=Number(element);
        return true;
    });
    if(mul == 'Error')
        return 'All parameters must be numbers';
    return mul;
}).public();
server.register('fib',(params)=>{
    if(isNaN(Number(params[0])))
        return 'Wrong parameter type';
    switch(params[0]){
        case 0:
            return [];
        case 1:
            return [0];
        case 2:
            return [0,1];
        default:
            let fib = [0,1];
            for(let i = 0; i < params[0]-2; i++){
                fib.push(fib[i]+fib[i+1]);
            }
            return fib;
    }
}).protected();
server.register('fact',(params)=>{
    if(isNaN(Number(params[0]))){
        console.log('Wrong parameter type');
        return;
    }
    return fact(Number(params[0]));
}).protected();