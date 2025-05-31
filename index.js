const express = require("express");
const app = express();

app.get('/', (req, res) => {

    res.json({message: "working"})
});

app.listen(40444, () => {
        console.log('Сервер запущен на порту 40444')});
