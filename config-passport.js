const passport = require ('passport');
const LocalStorage = require('passport-local').Strategy;

// "фейковый" аккаунт

const userDB = {
    id: 1,
    email: 'test@mail.ru',
    password: '123',
};

//сериализация и десериализация объекта request.user в сессию/из сессии

passport.serializeUser((user, done) => {
   console.log('сериализация: ', user); 
  done(null, user.id); // в сессии будем хранить пользовательский id 
});

// passport.deserializeUser((id, done) => { 
//   User.findOne({where: {id}}).then((user) => { // по id найти в БД 
//     done(null, user);
//     return null;
//   });
// });

// упрощения десериализации (у нас нет БД)
passport.deserializeUser((id, done) => {
  console.log('Десериализация:', id);
  const user = (userDB.id === id) ? userDB : false;
  done(null, user);
  });

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false, {message: 'Incorrect username'}); }
//       if (!user.verifyPassword(password)) { return done(null, false, {message: 'Incorrect password'}); }
//       return done(null, user);
//     });
//   }
// ));  

passport.use(
  new LocalStrategy({usernameField: 'email'},
   function(email, password, done) {
    if (email === userDB.email && password === userDB.password) {
        return done(null, userDB)
    } else {
        return done(null, false)
    }
    
  })
);