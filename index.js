// requires express module
const express = require ('express'),
    morgan = require ('morgan');
const app = express();

// example data set of movies
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

// middleware functions
app.use (morgan('common'));
app.use(express.static('public'));

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

