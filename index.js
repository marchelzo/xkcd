const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const port = 3000;
const count = new Map();

let MAX;

function withComic(id, f) {
    const url = 'https://xkcd.com/' +
                (id && `${id}/` || '') +
                'info.0.json';

    https.request(url, {}, r => {
        let json = '';
        r.on('data', chunk => {
            json += chunk;
        });
        r.on('end', () => {
            f(JSON.parse(json));
        });
    }).end();
}

function sendComic(id, res) {
    withComic(id, comic => {
        const views = (count.get(comic.num) || 0) + 1;
        count.set(comic.num, views);
        res.json({...comic, views});
    });
}

app.use(cors());
app.use(express.static('static'));

app.get('/:id(\\d+)', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

app.get('/:id(\\d+).json', (req, res) => {
    const id = +req.params.id;
    sendComic(id, res);
});

app.get('/random.json', (req, res) => {
    const id = (Math.random() * MAX) | 0;
    sendComic(id, res);
});

withComic(0, c => {
    MAX = c.num;
});

app.listen(port, () => {
    console.log('We out here...');
});
