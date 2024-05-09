const { sendMail} = require('./config');

class Mailer {
    static async sendEmail(type, toMail, subject, content) {
        try {
            const isHtml = type === 'html';
            const response = await sendMail(toMail, subject, content, isHtml);
            console.log("📭 the message has been sent successfully", response);
        } catch (error) {
            console.error("Rejected: error sending the message\n" + error);
        }
    }

    static sendEmailMessage(toMail, username, message) {
        this.sendEmail('text', toMail, 'Email verification', `Hello ${username}, ${message}`)
            .then(console.log('Message send'));
    }
    static sendSupportEmailMessage(mail, username, message) {
        this.sendEmail('text', "lotus.service.no.reply@gmail.com", 'Support', `| ${username} | ${mail} | ${message}`)
            .then(console.log('Message send'));
    }

    static sendEmailSystemNotification(toMail, message) {
        this.sendEmail('text', toMail, 'System notification', message)
            .then(console.log('Message send'));
    }

    static sendEmailUserRegistered(toMail, username) {
        this.sendEmail('html', toMail, `Congratulations on the successful registration of ${username}!`, "userRegistered.html")
            .then(console.log('Message send'));
    }
}

module.exports = { Mailer };
