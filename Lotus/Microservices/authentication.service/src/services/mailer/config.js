const fs = require('fs');
const nodemailer = require('nodemailer');

// Синхронное чтение файла параметров
let rawParams = fs.readFileSync('D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Microservices\\authentication.service\\src\\services\\mailer\\mail_params.json');
let mailParams = JSON.parse(rawParams);


function send(toMail, message) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: mailParams.params.mail,
            pass: mailParams.params.password
        }
    });

    let mailOptions = {
        from: mailParams.mail,
        to: toMail,
        subject: 'Email Verification',
        text: message
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info.response);
            }
        });
    });
}

module.exports = { send };