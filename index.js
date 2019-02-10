const express = require('express');
const rp = require('request-promise');
var os = require('os');

const app = express();

app.get('/', function (req, res, next) {
    rp('https://www.konspiratori.sk/assets/downloads/zoznam.txt')
        .then(function (body) {
            res.send(body.split(/[\r\n]+/).map(function (obj) {
                return obj.split(',')[0]
            }).join(os.EOL))
        }).catch(next)

});

app.listen(5000);
