const Koa = require('koa');
const Router = require('koa-router');
const passport = require('koa-passport');
const session = require('koa-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { USER: User } = require('../database/models/user');
const app = new Koa();
app.keys = ['your-session-secret'];
app.use(session(app));
app.use(passport.initialize());
app.use(passport.session());

const router = new Router();



const fs = require('fs');
let rawParams = fs.readFileSync('D:\\FILES\\University\\3 course\\2term\\Course Project\\Lotus\\Microservices\\authentication.service\\tsconfig.json');
let Params = JSON.parse(rawParams);



passport.use(new GoogleStrategy({
        clientID: Params.google.clientID,
        clientSecret: Params.google.clientSecret,
        callbackURL: "http://localhost:31002/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        // Здесь вы можете проверить, есть ли пользователь в вашей базе данных
        // Если нет, создайте нового пользователя с помощью информации из profile
        // Не забудьте сохранить пользователя в Redis если это требуется
        const user = await User .findOrCreate({
            where: { googleId: profile.id },
            defaults: {
                username: profile.displayName,
                email: profile.emails[0].value,
                // Здесь вы можете установить другие необходимые поля
            }
        });
        done(null, user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findByPk(id);
    done(null, user);
});


router.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (ctx) => {
        console.log("✅✅✅✅\t success verification");
        ctx.redirect('/');
    }
);

module.exports = router;
