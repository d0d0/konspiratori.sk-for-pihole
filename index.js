const express = require('express');
const rp = require('request-promise');
const os = require('os');
const fs = require('fs');

const app = express();
let blocked = new Set();

fs.readFile('blocked', (err, data) => {
    if (data) {
        const lines = data.toString().split(os.EOL)
        blocked = new Set(lines)
    }
})

app.get('/', function (req, res, next) {
    rp('https://www.konspiratori.sk/assets/downloads/zoznam.txt')
        .then((body) => {
                const actual = body
                    .split(/[\r\n]+/)
                    .map(obj => obj.split(',')[0])
                    .map(obj => [obj, 'www.' + obj])
                    .flatMap(obj => obj)

                actual.forEach((obj) => blocked.add(obj))
                res.send(Array.from(blocked).join(os.EOL))
            }
        ).catch(next);
});

const server = app.listen(5000);

const onKill = () => {
    const values = Array.from(blocked).join(os.EOL)
    fs.writeFile('blocked', values, (err) => {
        process.exit(0);
    });
}

process.on('SIGINT', onKill)
process.on('SIGTERM', onKill)
