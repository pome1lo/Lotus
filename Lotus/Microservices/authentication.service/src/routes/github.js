const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const passport = require('koa-passport');
const GitHubStrategy = require('passport-github').Strategy;
const { USER } = require('../database/models/user');
const fs = require('fs');

const router = new Router();

const {sendToQueue} = require("../services/RabbitMQ/sendToQueue");
let rawParams = fs.readFileSync('D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Microservices\\authentication.service\\tsconfig.json');
let Params = JSON.parse(rawParams);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await USER.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(new GitHubStrategy({
        clientID: Params.github.clientID,
        clientSecret: Params.github.clientSecret,
        callbackURL: "http://localhost:31002/api/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        let user = await USER.findOne({ where: { GITHUB_ID: profile.id } });

        if (!user) {
            user = await USER.create({
                GITHUB_ID: profile.id,
                USERNAME: profile.username,
                EMAIL: profile.emails[0].value, // can be null!
                IS_EMAIL_VERIFIED: true
            });
        }

        let userData = {
            USERNAME: profile.displayName,
            EMAIL: profile.emails[0].value
        }

        sendToQueue('userRegistered', userData);

        return done(null, user);
    }
));

router.get('/api/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));


router.get('/api/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (ctx) => {
        ctx.redirect('/');
    }
);

router.get('/api/auth/github/logout', (ctx) => {
    ctx.logout();
    ctx.redirect('/');
});

module.exports = router;
