// módulos necessários
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const objectId = require('mongodb').ObjectID;
const multiparty = require('connect-multiparty');
const mv = require('mv'); // manipulação de arquivos dentro do nodejs em S.O linux. Windows fs = file system
const fs = require('fs'); // file system

// start do módulo express
const app = express();
// configurando middlwares
app.use(bodyParser.urlencoded({ extended: true })); // recebendo dados via url
app.use(bodyParser.json()); // recebendo dados no formato json
app.use(multiparty()); // forms com arquivos

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

    // fornecendo response para a nossa app client
    res.setHeader('Access-Control-Allow-Origin', '*');
    // http://localhost:3200
    // dados do formulário
    let dados = req.body;
    let date = new Date();
    let time_stamp = date.getTime();

    let url_imagem_file = time_stamp + '_' + req.files.arquivo.originalFilename;

    var path_origem = req.files.arquivo.path;
    var path_destino = './uploads/' + url_imagem_file;

    var success = undefined;

    mv(path_origem, path_destino, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        // res.status(200).json(dados);
        success = {
            url_img: url_imagem_file,
            title: req.body.titulo,
        };
    });

    // conectando e inserindo
    db.open((err, mongoclient) => {
        mongoclient.collection('postagens', (err, collection) => {
            collection.insert(success, (err, results) => {
                err ? res.json(err) : res.status(200).json(results);
                mongoclient.close();
            });
        });
    });

});

// método get
app.get('/api', (req, res) => {
    // fornecendo response para a nossa app client
    res.setHeader('Access-Control-Allow-Origin', '*');
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


app.get('/imagens/:imagem', (req, res) => {
    let img = req.params.imagem;

    fs.readFile('./uploads/' + img, (err, results) => {
        if (err) {
            res.status(400).json(err);
            return;
        }
        // definindo o cabeçalho -> contentType
        res.writeHead(200, { 'content-type': 'image/jpg' });
        res.end(results);
    });

});