// requires express module
const express = require ('express'),
    morgan = requiere ('morgan');
const app = express();

let topMovies = [
    {
        title: 'Movie',
        genre: 'Genre',
        actor: 'Actor',
    },
    {
        title: 'Movie',
        genre: 'Genre',
        actor: 'Actor',
    },
    {
        title: 'Movie',
        genre: 'Genre',
        actor: 'Actor',
    },
    {
        title: 'Movie',
        genre: 'Genre',
        actor: 'Actor',
    },
    {
        title: 'Movie',
        genre: 'Genre',
        actor: 'Actor',
    },
    {
        title: 'Movie',
        genre: 'Genre',
        actor: 'Actor',
    },
    {
        title: 'Movie',
        genre: 'Genre',
        actor: 'Actor',
    },
    {
        title: 'Movie',
        genre: 'Genre',
        actor: 'Actor',
    },
    {
        title: 'Movie',
        genre: 'Genre',
        actor: 'Actor',
    },
    {
        title: 'Movie',
        genre: 'Genre',
        actor: 'Actor',
    },
    {
        title: 'Movie',
        genre: 'Genre',
        actor: 'Actor',
    },
];

app.use (morgan('common'));
// GET reguests
app.get('/', (req, res) => {
    res.send('Welcome to my movie app');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});
// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

