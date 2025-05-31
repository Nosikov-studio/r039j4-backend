const app = require('./app');

app.get('/', (req, res) => {

    res.json({message: "working2"})
});

app.listen(40444, () => {
        console.log('Сервер запущен на порту 40444')});
