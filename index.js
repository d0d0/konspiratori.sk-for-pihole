const express = require('express');
const rp = require('request-promise');
const os = require('os');

const app = express();
let blocked = new Set();

app.get('/', function (req, res, next) {
    rp('https://www.konspiratori.sk/assets/downloads/zoznam.txt')
        .then((body) => {
                const actual = body
                    .split(/[\r\n]+/)
                    .map(obj => obj.split(',')[0])
                    .map(obj => [obj, 'www.' + obj])
                    .flatMap(obj => obj)

                blocked.add(actual)
                res.send(Array.from(blocked).join(os.EOL))
            }
        ).catch(next);
});

app.listen(5000);
