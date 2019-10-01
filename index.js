const express = require('express');
const rp = require('request-promise');
const os = require('os');
const fs = require('fs');

const app = express();
let blocked = new Set();

fs.readFile('blocked', (err, data) => {
    const lines = data.toString().split(os.EOL)
    blocked = new Set(lines)
})

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

process.on('SIGTERM', () => {
    const values = Array.from(blocked).join(os.EOL)
    fs.writeFile('blocked', values, (err) => {
        process.exit(0);
    });
});

app.listen(5000);
