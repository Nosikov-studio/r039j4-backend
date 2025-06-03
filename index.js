// вариант 2 - весь код в одном файле
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const app = express();

// "фейковый" аккаунт для демонстрации
const userDB = {
    id: 1,
    email: 'test@mail.ru',
    password: '123',
};

app.use(express.urlencoded({ extended: false })); // для парсинга данных из формы (application/x-www-form-urlencoded)

//подключение сессии//////////////где хранится сессия??????????//////////////////
// В данном случае сессия хранится в памяти сервера (MemoryStore)
app.use(session({
  secret: 'abrakatabra', // секретный ключ для подписи cookie сессии
  resave: false, // не сохранять сессию, если она не изменялась
  saveUninitialized: false //не создавать сессию, если она не инициализирована
}));

//Инициализация Passport и подключение сессий Passport
app.use(passport.initialize());
app.use(passport.session());

// Настройка стратегии локальной аутентификации
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
// Сериализация пользователя — определяет, что именно сохраняется в сессии
passport.serializeUser((user, done) => {
   console.log('сериализация: ', user); 
  done(null, user.id); // в сессии будем хранить пользовательский id 
});

// Десериализация пользователя — по id из сессии восстанавливаем объект пользователя
passport.deserializeUser((id, done) => {
  console.log('Десериализация:', id);
  const user = (userDB.id === id) ? userDB : false;
  done(null, user);
  });
// Главная страница
app.get('/', (req, res) => {res.send('Hello World!')});

//////////////////////////////////////////////////////////////////
//Обработка POST-запроса на логин с использованием кастомной callback-функции
app.post('/login', (req, res, next) => {
  passport.authenticate('local', function(err, user){
    if (err) {
      return next(err); // если ошибка, передаем дальше
    }
    if (!user){
      return res.send('Укажите правильный имэйл или пароль'); // если пользователь не найден или пароль неверен
    }
// Устанавливаем сессию для аутентифицированного пользователя    
    req.logIn(user, function(err){ // req.logIn — это метод, который позволяет установить сеанс для пользователя, который только что был успешно аутентифицирован.
      if (err) {
        return next(err);
      }
      return res.redirect('/admin'); // перенаправляем после успешного входа
    });
  })(req, res, next); // вызываем middleware Passport с текущими req, res, next
});

//////////////////////////////////////////////////////////////////////
// Middleware для проверки авторизации пользователя
const auth = (req, res, next) => {
  if(req.isAuthenticated()) { // проверяем, аутентифицирован ли пользователь
    next(); //если да, пропускаем дальше
  } else 
  return res.redirect('/'); // если нет, перенаправляем на главную
}
// Защищенный маршрут, доступный только авторизованным пользователям
app.get('/admin',auth, (req, res) => {
  res.send('Admin page')
})

// Запуск сервера на порту 4444
app.listen(4444, () => {
  console.log('Сервер запущен на порту 4444');
});