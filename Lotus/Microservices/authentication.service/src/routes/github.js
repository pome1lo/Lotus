const Router = require('koa-router');
const passport = require('koa-passport');
const GitHubStrategy = require('passport-github').Strategy;
const { USER } = require('../database/models/user');
const {sendToQueue} = require("../services/RabbitMQ/sendToQueue");
const fs = require('fs');
const path = require("path");

const router = new Router();

const isDocker = process.env.APP_PORT == null;
const PathToConfig = isDocker ? '/app' : 'D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\configs';

let rawParams = fs.readFileSync(path.join(PathToConfig, 'tsconfig_auth.json'));
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
        callbackURL: "https://localhost:31002/api/auth/github/callback"
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
