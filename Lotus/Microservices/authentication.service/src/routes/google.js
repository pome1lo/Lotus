const Router = require('koa-router');
const passport = require('koa-passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { USER } = require('../database/models/user');
const fs = require('fs');
const {sendToQueue} = require("../services/RabbitMQ/sendToQueue");
const path = require("path");


const router = new Router();

const isDocker = process.env.APP_PORT == null;
const PathToConfig = isDocker ? 'D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Static\\configs' : '/app';
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


passport.use(new GoogleStrategy({
        clientID: Params.google.clientID,
        clientSecret: Params.google.clientSecret,
        callbackURL: "https://localhost:31901/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        let user = await USER.findOne({ where: { GOOGLE_ID: profile.id } });

        if (!user) {
            user = await USER.create({
                GOOGLE_ID: profile.id,
                USERNAME: profile.displayName,
                EMAIL: email,
                IS_EMAIL_VERIFIED: true
            });
        }
        let userData = {
            USERNAME: profile.displayName,
            EMAIL: email
        }

        sendToQueue('userRegistered', userData);

        return done(null, user);
    }
));

router.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (ctx) => {
        ctx.redirect('https://lotus:3000/');
    }
);

router.get('api/auth/google/logout', (ctx) => {
    ctx.logout();
    ctx.redirect('https://localhost:3000/');
});

module.exports = router;
