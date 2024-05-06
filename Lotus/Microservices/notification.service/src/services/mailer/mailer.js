const { sendHtml, sendText } = require('./config');

class Mailer {
    static async sendEmail(type, toMail, subject, content) {
        try {
            if (type === 'text') {
                await sendText(toMail, subject, content);
            } else if (type === 'html') {
                await sendHtml(toMail, subject, content);
            }
            console.log("📭 the message has been sent successfully");
        } catch (error) {
            console.error("Rejected: error sending the message\n" + error);
        }
    }

    static sendEmailMessage(toMail, username, message) {
        this.sendEmail('text', toMail, 'Hello', `Hello ${username}, ${message}`);
    }

    static sendEmailSystemNotification(toMail, message) {
        this.sendEmail('text', toMail, 'System notification', message);
    }

    static sendEmailUserRegistered(toMail, username) {
        this.sendEmail('html', toMail, `Congratulations on the successful registration of ${username}!`, "userRegistered.html");
    }
}

module.exports = { Mailer };
