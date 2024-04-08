const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const passport = require('koa-passport');
const GitHubStrategy = require('passport-github').Strategy;
const { USER: User } = require('../database/models/user');

const router = new Router();

const fs = require('fs');
const {sendToQueue} = require("../services/RabbitMQ/sendToQueue");
let rawParams = fs.readFileSync('D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Microservices\\authentication.service\\tsconfig.json');
let Params = JSON.parse(rawParams);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
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
        let user = await User.findOne({ where: { githubId: profile.id } });

        if (!user) {
            user = await User.create({
                githubId: profile.id,
                username: profile.username,
                email: profile.emails[0].value, // can be null!
                isEmailVerified: true
            });
        }

        let userData = {
            UserName: profile.displayName,
            Email: profile.emails[0].value
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
        console.log("✅✅✅✅t success verification");
        ctx.redirect('/');
    }
);

router.get('/api/auth/github/logout', (ctx) => {
    ctx.logout();
    ctx.redirect('/');
});

module.exports = router;
