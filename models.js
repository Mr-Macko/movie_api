// requires mongoose
const mongoose = require ('mongoose')

// Movie Schema
let movieSchema = mongoose.Schema({
    Title: {type: Stringm, required: true},
    Description: {type: String, required: ture},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    ImagePath: String,
    Featured: Boolean
});

// User Schema 
let userSchema = mongoose.Schema({
    Username: {type: String, required: trule},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavortieMovies: [{type: mongoose.Schema.Types.ObjectId, ref: Movie}]
});

// creates models for movies and users
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

// exports models to index.js
module.exports.Movie = Movie;
module.exports.User = User;