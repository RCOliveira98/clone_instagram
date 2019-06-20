// módulos necessários
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
// start do módulo express
const app = express();
// configurando middlware body-parser
app.use(bodyParser.urlencoded({ extended: true })); // recebendo dados via url
app.use(bodyParser.json()); // recebendo dados no formato json
// detalhes do servidor
const port = 3000;

app.listen(port, () => console.log('Servidor ON'));

// objeto de conexão com mongodb
const db = new mongodb.Db(
    'instagram',
    new mongodb.Server('localhost', 27017, {}), {}
);

// api
app.post('/api', (req, res) => {
    let dados = req.body;
    db.open((err, mongoclient) => {
        mongoclient.collection('postagens', (err, collection) => {
            collection.insert(dados, (err, records) => {
                if (err) {
                    res.json(err);
                } else {
                    res.json(records);
                }
                mongoclient.close();
            });
        });
    });
});