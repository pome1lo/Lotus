const { sendHtml, sendText } = require('./config');

class Mailer {

    static sendEmailMessage(toMail, subject, username, message) {
        sendText(toMail, subject, `Hello ${username}, ${message}`)
            .then(
                result => { console.log("📭 the message has been sent successfully"); },
                error => { console.log("Rejected: error sending the message\n" + error); }
            );
    }

    static sendEmailSystemNotification(toMail, username, message) {
        sendText(toMail, "System notification", message)
            .then(
                result => { console.log("📭 the message has been sent successfully"); },
                error => { console.log("Rejected: error sending the message\n" + error); }
            );
    }

    static sendEmailUserRegistered(toMail, username) {
        sendHtml(toMail, `Congratulations on the successful registration of ${username}!`, "userRegistered.html")
            .then(
                result => { console.log("📭 the message has been sent successfully"); },
                error => { console.log("Rejected: error sending the message\n" + error); }
            );
    }
}

module.exports = { Mailer };
