const express = require('express');
const rp = require('request-promise');
const os = require('os');

const app = express();

app.get('/', function (req, res, next) {
    rp('https://www.konspiratori.sk/assets/downloads/zoznam.txt')
        .then(body => res.send(
            body
                .split(/[\r\n]+/)
                .map(obj => obj.split(',')[0])
                .map(obj => [obj, 'www.' + obj].join(os.EOL))
                .join(os.EOL)
            )
        )
        .catch(next);
});

app.listen(5000);
