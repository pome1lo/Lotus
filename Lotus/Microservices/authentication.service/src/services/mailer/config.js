const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require("path");

const isDocker = process.env.APP_PORT == null;
const PathToConfig = isDocker ? 'D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\configs' : '/app';

let rawParams = fs.readFileSync(path.join(PathToConfig, 'tsconfig_auth.json'));
let mailParams = JSON.parse(rawParams);


function send(toMail, message) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: mailParams.mailer.mail,
            pass: mailParams.mailer.password
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