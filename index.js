const express = require('express');
const cors = require('cors');
const https = require('https');
const path = require('path');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;
const count = new Map();

let MAX_ID;

async function fetchComic(id) {
    const url = 'https://xkcd.com/' +
                (id && `${id}/` || '') +
                'info.0.json';

    try {
        const c = await axios.get(url);
        return c.data;
    } catch (e) {
        console.log(e);
    }
}

async function sendComic(id, res) {
    const comic = await fetchComic(id);
    if (comic) {
        comic.views = (count.get(comic.num) || 0) + 1;
        count.set(comic.num, comic.views);
        res.json(comic);
    } else {
        res.status(404);
    }
}

app.use(cors());

app.use(express.static(path.join(__dirname, 'static')));

app.get('/:id(\\d+)', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.get('/:id(\\d+).json', (req, res) => {
    const id = +req.params.id;
    sendComic(id, res);
});

app.get('/random.json', (req, res) => {
    const id = 1 + (Math.random() * MAX_ID) | 0;
    sendComic(id, res);
});

fetchComic(0).then(c => {
    MAX_ID = c.num;
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
        console.log(`Latest comic is ${MAX_ID}`);
    });
});

