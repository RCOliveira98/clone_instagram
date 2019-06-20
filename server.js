// módulos necessários
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const objectId = require('mongodb').ObjectID;
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

// método post
app.post('/api', (req, res) => {
    let dados = req.body;
    db.open((err, mongoclient) => {
        mongoclient.collection('postagens', (err, collection) => {
            collection.insert(dados, (err, results) => {
                err ? res.json(err) : res.status(200).json(results);
                mongoclient.close();
            });
        });
    });
});

// método get
app.get('/api', (req, res) => {
    db.open((err, mongoclient) => {
        mongoclient.collection('postagens', (err, collection) => {
            collection.find().toArray((err, results) => {
                err ? res.json(err) : res.status(200).json(results);
                mongoclient.close();
            });
        });
    });
});

// método get by id
app.get('/api/:id', (req, res) => {
    db.open((err, mongoclient) => {
        mongoclient.collection('postagens', (err, collection) => {
            collection.find(objectId(req.params.id)).toArray((err, results) => {
                err ? res.json(err) : res.status(200).json(results);
                mongoclient.close();
            });
        });
    });
});

// método put by id
app.put('/api/:id_item', (req, res) => {
    db.open((err, mongoclient) => {
        mongoclient.collection('postagens', (err, collection) => {
            collection.update({ _id: objectId(req.params.id_item) }, // condição da query
                { $set: { title: req.body.title, img: req.body.img } }, //action
                {}, // essa ação deve se propagar por múltiplas linha? Default: No. {multi: false ou true}
                (err, results) => {
                    err ? res.json(err) : res.status(200).json(results);
                    mongoclient.close();
                }
            );
        });
    });
});

// método delete by id
app.delete('/api/:id', (req, res) => {
    db.open((err, dbclient) => {
        dbclient.collection('postagens', (erro, colecao) => {
            colecao.remove({ _id: objectId(req.params.id) }, (erro, results) => {
                erro ? res.json(erro) : res.status(200).json(results);
                dbclient.close();
            });
        });
    });
});