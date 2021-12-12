// integrates mongoose
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const User = Models.User;

// connects mongoose to mongodb database (movies and users)
mongoose.connect('mongodb://localhost:27017/movie-api-db', { useNewUrlParser: true, useUnifiedTopology: true });

// requires express module
const express = require ('express');
const morgan = require ('morgan');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

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

// main/starting request
app.get('/', (req, res) => {
    res.send('Welcome to my movie app');
});

// Get request for documentation page
app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });

// Gets the list of data about ALL movies
app.get('/movies', (req, res) => {
   res.json(movies);
});

// Gets data of a single movie, by name
app.get('/movies/:title', (req, res) => {
    res.send('Successful GET request returning data of single movie, by title');
});

// Gets data of genre by genre name
app.get('/movies/genre/:name', (req, res) => {
    res.send('Successful GET request returning data of single genre, by genre name');
});

// Gets data of director by name
app.get('/directors/:name', (req, res) => {
    res.send('Successful GET request returning data of single director, by name');
});

// Creates new user
app.post('/user', (req, res) => {
    res.send('Successful POST request creating new user');
});

// Updates data of user
app.put('/user/:username', (req, res) => {
    res.send('Successful PUT request updating data of user');
});

// Adds movie to users favorites list
app.put('/user/:username/movies/:favorites', (req, res) => {
    res.send('Successful PUT request adding movie to favorites list');
});

// removes movie from users favorites list
app.delete('/user/:username/movies/:favorites', (req, res) => {
    res.send('Successful DELETE request removes movie to favorites list');
});

// deletes user from database
app.delete('/user/:userID', (req, res) => {
    res.send('Successful DELETE request removes user from database');
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

