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
    rp('https://konspiratori.sk/static/lists/zoznam.txt')
        .then((body) => {
                let actual = body
                    .split(/[\r\n]+/)
                    .map(obj => obj.split(',')[0])
                    .map(obj => [obj, 'www.' + obj])

                if (Array.prototype.flatMap) {
                    actual = actual.flatMap(obj => obj)
                } else {
                    const concat = (x, y) => x.concat(y)
                    const flatMap = (xs) => xs.reduce(concat, [])

                    actual = flatMap(actual)
                }


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
