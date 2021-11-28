// requires express module
const express = require ('express');
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

// GET reguests
app.get('/', (req, res) => {
    res.send('Welcome to my movie app');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});
