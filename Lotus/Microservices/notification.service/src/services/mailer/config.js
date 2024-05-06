const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require("path");

const CONFIG_PATH = process.env.APP_PORT ? '/app' : 'D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\configs';
const HTML_PATH = "D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Microservices\\notification.service\\src\\assets\\html\\";

const mailParams = JSON.parse(fs.readFileSync(path.join(CONFIG_PATH, 'tsconfig_notify.json')));

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: mailParams.mailer.mail,
        pass: mailParams.mailer.password
    }
});

async function sendMail(toMail, subject, content, isHtml = false) {
    let mailOptions = {
        from: mailParams.mail,
        to: toMail,
        subject: subject
    };

    if (isHtml) {
        const htmlPath = path.join(HTML_PATH, content);
        console.log(htmlPath);
        mailOptions.html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';
    } else {
        mailOptions.text = content;
    }

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

module.exports = { sendMail };
