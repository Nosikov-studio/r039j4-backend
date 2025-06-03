// вариант 1 - код в двух файлах, еще config-passport.js
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//подключение сессии//////////////////////////////////////////////
app.use(
  session({
    secret: 'abracatabra',
    store: new FileStore(),
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 60*60*1000,
    },
    resave: false,
    saveUninitialized: false
  })
)
/////////////////////////////////////////////////////////////
require('./config-passport');
app.use(passport.initialize());
app.use(passport.session());
/////////////////////////////////////////////////////////////

app.get('/', (req, res) => {res.send('Hello World!')});
/////////////////////////////////////////////////////////////
app.post('/login', (req, res, next) => {
  passport.authenticate('local', function(err, user){
    if (err) {
      return next(err);
    }
    if (!user){
      return res.send('Укажите правильный имэйл или пароль');
    }
    req.logIn(user, function(err){ // req.logIn — это метод, который позволяет установить сеанс для пользователя, который только что был успешно аутентифицирован.
      if (err) {
        return next(err);
      }
      return res.redirect('/admin');
    });
  })(req, res, next);
});

////////////////////////////////////////////////////////////////
const auth = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();
  } else 
  return res.redirect('/');
}
///////////////////////////////////////////////////////

app.get('/admin',auth, (req, res) => {
  res.send('Admin page')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})