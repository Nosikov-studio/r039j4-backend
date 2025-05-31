const express = require("express");
const cors = require('cors')
const morgan = require('morgan')
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')
const app = express();
// Начиная с версии Express 4.16.0, пакет body-parser официально считается устаревшим 
// (deprecated), поскольку его функциональность была интегрирована непосредственно 
// в сам Express. Это означает, что теперь для разбора тела HTTP-запросов 
// (например, JSON или URL-кодированных данных) не нужно устанавливать и использовать 
// отдельный модуль body-parser — вместо этого можно использовать встроенные 
// методы Express: express.json() и express.urlencoded()

 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 app.use(cors());
 app.use(morgan());


app.use('/api/auth', authRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)

module.exports=app;