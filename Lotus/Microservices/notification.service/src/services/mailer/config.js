const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require("path");

const isDocker = process.env.APP_PORT == null;
const PathToConfig = isDocker ? 'D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\configs' : '/app';

let rawParams = fs.readFileSync(path.join(PathToConfig, 'tsconfig_notify.json'));
let mailParams = JSON.parse(rawParams);


let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: mailParams.mailer.mail,
        pass: mailParams.mailer.password
    }
});

async function sendHtml(toMail, subject, htmlPage) {
    const htmlPath = path.join("D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Microservices\\notification.service\\src\\assets\\html\\", htmlPage);
    console.log(htmlPath);
    const htmlContent = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';

    let mailOptions = {
        from: mailParams.mail,
        to: toMail,
        subject: subject,
        html: htmlContent
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) { reject(error);
            } else { resolve(info.response);}
        });
    });
}

async function sendText(toMail, subject, message) {
    let mailOptions = {
        from: mailParams.mail,
        to: toMail,
        subject: subject,
        text: message
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) { reject(error);
            } else { resolve(info.response);}
        });
    });
}

module.exports = { sendHtml, sendText };
