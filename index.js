// requires express module
const express = require ('express');
const morgan = require ('morgan');
const app = express();

// example data set of movies
let movies = [
    {
        "title": "Movie",
        "genre": "Genre",
        "actor": "Actor",
        "director": "Director"
    },
    {
        "title": "Movie",
        "genre": "Genre",
        "actor": "Actor",
        "director": "Director"
    },
    {
        "title": "Movie",
        "genre": "Genre",
        "actor": "Actor",
        "director": "Director"
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

app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });

// error handler  
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
    });

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

