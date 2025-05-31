const express = require("express");
const app = express();
app.use(express.json());
/////////////////////////////////////////////
const cors = require('cors');
// const corsOptions = {
//   origin: 'https://truruky.ru',  // домен фронтенда
//   credentials: true,             // разрешаем куки
// };
// app.use(cors(corsOptions));
app.use(cors());
///////////////MONGODB///////////////////////
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true}); 

const userSchema = new mongoose.Schema({
    googleId: String,
    name: String,
});

const User = mongoose.model('User', userSchema);

///////////////Passport/////////////////////////
var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function (user, done){
    done(null, user.id);
});
//*********************устаревший синтаксис************************************************** */
// passport.deserializeUser(function (id, done){
//     User.findById(id, function (err, user) {
//         err
//           ? done(err)
//           : done(null, user);
//     });
// });

//*****************замена************************************************************ */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
//***************************устаревший************************************************************* */
// passport.use(new GoogleStrategy({
//     clientID: "1059565581219-qrlt8clvqv2dua7inn40rte2o4h8g4c7.apps.googleusercontent.com", //???
//     clientSecret: "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", //???
//     callbackURL: "http://truruki.ru/auth/google/callback" //???
// },
//     function (accessToken, refreshToken, profile, done) {
//         // User.findOne({
//         //     'googleId': profile.id
//         // }, function(err, user){
//         //     if (err) {
//         //         return done(err);
//         //     }

//         //     if (!user) {
//         //         user = new User ({
//         //             googleId: profile.id,
//         //             name: profile._json.name,
//         //         });
//         //         user.save(function (err) {
//         //             if (err) console.log(err);
//         //             return done(err, user);
//         //         });
//         //     } else {
//         //         return done(err, user);
//         //     }
//         // });


//     }
// ));
// Начиная с версии Mongoose 7 и MongoDB Node.js драйвера 5.0, 
// методы модели (включая findOne) больше не поддерживают передачу callback-функций. 
// Теперь они всегда возвращают промис.
//********************************замена************************************************** */
passport.use(new GoogleStrategy({
    clientID: "1059565581219-qrlt8clvqv2dua7inn40rte2o4h8g4c7.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://truruki.ru:40444/auth/google/callback"
},
async function(accessToken, refreshToken, profile, done) {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile._json.name,
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
//***************************************************************************** */
const expressSession = require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
});

app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

app.get('/login',
    passport.authenticate('google', {            // какую инфу хотим получить от google по клиенту
        scope:['https://www.googleapis.com/auth/userinfo.profile',     // хотим профиль
            'https://www.googleapis.com/auth/userinfo.email']          //хотим эмэйл
    }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login'}),
        function (req, res) {
            res.redirect('/');
        }
    );

    app.get('/', (req, res) => {
        if (typeof req.user === 'undefined') {
            res.send('<a href="/login">Продолжить с Google</a>')
        } else {
            res.send(req.user.name)
        }
    });

    app.listen(40444, () => {
        console.log('Сервер запущен на порту 40444')});
