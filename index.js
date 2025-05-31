const app = require('./app');
const port = process.env.PORT || 40444;

app.get('/', (req, res) => {

    res.json({message: "working2"})
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`)});
