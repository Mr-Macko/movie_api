// integrates mongoose
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// connects mongoose to LOCAL mongodb database (movies and users)
//mongoose.connect('mongodb://localhost:27017/movie-api-db', { useNewUrlParser: true, useUnifiedTopology: true });

// connects mongoose to REMOTE mongodb database (movies and users)
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// requires express-validator
const {check, ValidationResult} = require('express-validator');

// requires express module
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// middleware functions
app.use(morgan('common'));
app.use(express.static('public'));

// requires CORS
const cors = require('cors');
app.use(cors());

// requires auth.js
let auth = require('./auth')(app);

// requires passport.js
const passport = require('passport');
require('./passport');

// ***Server ENDPOINTS***
// main/starting request
app.get('/', (req, res) => {
    res.send('Welcome to my movie app');
});

// Get request for documentation page
app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

// Gets the list of data about ALL movies 61b2644cd8b1a67422eb3e7a
app.get('/movies', passport.authenticate ('jwt', {session: false}),(req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Gets data of a single movie, by name
app.get('/movies/:title', passport.authenticate ('jwt', {session: false}), (req, res) => {
    Movies.findOne({Title: req.params.title})
        .then((movie) => {
            res.json(movie)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Gets data of genre by genre name
app.get('/genres/:genre', passport.authenticate ('jwt', {session: false}), (req, res) => {
    Movies.findOne({"Genre.Name": req.params.genre})
        .then((movie) => {
            res.json(movie.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Gets data of director by name
app.get('/directors/:name', passport.authenticate ('jwt', {session: false}), (req, res) => {
    Movies.findOne({"Director.Name": req.params.name})
        .then((movie) => {
            res.json(movie.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Creates new user
app.post('/users', passport.authenticate ('jwt', {session: false}), (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Updates data of user
app.put('/users/:username', passport.authenticate ('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.username }, { $set:
        {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true },
      (err, updatedUser) => {
        if(err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      });
    });

// Adds movie to users favorites list
app.post('/users/:username/movies/:movieid', passport.authenticate ('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.username }, {
       $push: { FavoriteMovies: req.params.movieid }
     },
     { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

// removes movie from users favorites list
app.delete('/users/:username/movies/:movieid', passport.authenticate ('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.username }, {
     $pull: { FavoriteMovies: req.params.movieid }
   },
   { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// deletes user from database
app.delete('/users/:username', passport.authenticate ('jwt', {session: false}), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// error handler  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

