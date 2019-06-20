// módulos necessários
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
// start do módulo express
const app = express();
// configurando middlware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// detalhes do servidor
const port = 3000;

app.listen(port, () => console.log('Servidor ON'));