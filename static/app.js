const comic = {
    img: document.querySelector('.comic img'),
    title: document.querySelector('.comic-title'),
    date: document.querySelector('.comic-date'),
    views: document.querySelector('.comic-views'),
    transcript: document.querySelector('.transcript')
};

const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');
const randomButton = document.querySelector('.random');

/*
 * Get the initial comic ID from the URL. If there is no
 * ID specified, this ends up as 0 (latest comic)
 */
let id = +window.location.pathname.split('/').pop();

/*
 * Really basic transcript parsing / formatting.
 *
 * [[TEXT]] becomes <em>TEXT</em>
 *      and
 * NAME: TEXT becomes <strong>NAME: </strong>TEXT
 */
function format(s) {
    s = s.replace(/\[\[(.+)\]\]/g, (_, s) => `<em>${s}</em> `);
    s = s.replace(/^[^:]{1,18}: /, s => `<strong>${s}</strong>`);
    return s;
}

function render(c) {
    comic.img.src = c.img;
    comic.img.alt = comic.img.title = c.alt;
    comic.title.innerText = c.title;
    comic.date.innerText = `${c.year}/${c.month}/${c.day}`;
    comic.views.innerText = `${c.views} view${c.views != 1 && 's' || ''}`;

    console.log(c);

    comic.transcript.innerHTML = '';

    const lines = c.transcript
                   .replace(/\{\{.*\}\}$/s, '')
                   .split('\n');

    for (const line of lines) {
        const p = document.createElement('p');
        p.innerText = line;
        p.innerHTML = format(p.innerHTML);
        comic.transcript.appendChild(p);
    }
}

function load(newID) {
    fetch(`/${newID}.json`).then(r => r.json()).then(c => {
        id = c.num;
        window.history.replaceState({page: id}, null, `/${id}`);
        render(c);
    });
}

nextButton.addEventListener('click', () => load(id + 1));
prevButton.addEventListener('click', () => load(id - 1));
randomButton.addEventListener('click', () => load('random'));

load(id);
