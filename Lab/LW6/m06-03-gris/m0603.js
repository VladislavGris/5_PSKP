const nodemailer = require('nodemailer')
var emailFrom = '';
var emailTo = '';
var password = '';

async function send(message){
    transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: emailFrom,
            pass: password,
        },
    });
    info = await transporter.sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'Mail',
        text: message,
    });
    if(info.accepted){
        return 'Success';
    }else{
        return 'Fail';
    }
}

exports.send = send