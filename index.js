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
const {check, validationResult} = require('express-validator');

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
let allowedOrigins = ['http://localhost:1234','https://max-myflix.netlify.app','http://localhost:4200',"https://mr-macko.github.io",];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

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

/**
 * Endpoint to GET entire movie database.
 * @method get
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object of all movies' data
 */
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

/**
 * Endpoint to GET single movie object by title.
 * @method get
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object of a single movie's data
 */
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

/**
 * Endpoint to GET single genre object by name.
 * @method get
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object of single genre.
 */
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

/**
 * Endpoint to GET single director object by name.
 * @method get
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object of single director.
 */
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

/**
 * Endpoint to POST a new user.
 * @method post
 * @param {req.body} - JSON object format required:
 * {
 * "Username": "username",
 * "Password": "password",
 * "Email" : "username@gmail.com",
 * "Birthday" : Date,
 * }
 */
app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Password', 'Password must be 8 characters long').isLength({min: 8}),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) //search to see if User already exists
    .then((user) => {
      if(user) { //if use is found send below response
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthdate: req.body.Birthdate
          })
          .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Erorr:' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error:' + error);
    });
});

//Get all users
/**
 * Get all users
 * @method get
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns a JSON object with all users
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req,res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

/**
 * Endpoint to PUT (update) a single user object by username.
 * @method put
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object of updated user details.
 */
app.put('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
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

/**
 * Endpoint to POST (add) a single movie by id to user favorites.
 * @method post
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object of updated user details.
 */
app.post('/users/:username/movies/:movieid', passport.authenticate('jwt', { session: false }), (req, res) => {
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

/**
 * Endpoint to DELETE a single movie by id from user favorites.
 * @method delete
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {object} - JSON object of updated user details.
 */
app.delete('/users/:username/movies/:movieid', passport.authenticate('jwt', { session: false }), (req, res) => {
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

/**
 * Endpoint to DELETE a user.
 * @method delete
 * @param {req.headers} object - headers {"Authorization" : "Bearer <jwt>"}
 * @returns {string} - confirmation message.
 */
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
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

