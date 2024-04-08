const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const passport = require('koa-passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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


passport.use(new GoogleStrategy({
        clientID: Params.google.clientID,
        clientSecret: Params.google.clientSecret,
        callbackURL: "http://localhost:31002/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (!user) {
            user = await User.create({
                googleId: profile.id,
                username: profile.displayName,
                email: email,
                isEmailVerified: true
            });
        }
        let userData = {
            UserName: profile.displayName,
            Email: email
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
        console.log("✅✅✅✅\t success verification");
        ctx.redirect('/');
    }
);

router.get('api/auth/google/logout', (ctx) => {
    ctx.logout();
    ctx.redirect('/');
});

module.exports = router;
