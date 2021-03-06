// requires bcrypt
const bcrypt = require('bcrypt');

// requires mongoose
const mongoose = require ('mongoose')

// Movie Schema
/**
 * Mongoose schema for movie objects.
 * {
 * Title: { type: String, required: true },
 * Description: { type: String, required: true },
 * Genre: {
 *   Name: String,
 *   Description: String,
 * },
 * Director: {
 *      Name: String,
 *      Bio: String,
 *      Birth: Date,
 *      Death: Date
 * },
 * ImagePath: String,
 * Featured: Boolean,
 *}
 */
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Birth: Date,
        Death: Date
    },
    ImagePath: String,
    Featured: Boolean
});

// User Schema 
/**
 * Mongoose schema for user objects.
 *{
 * Username: { type: String, required: true },
 * Password: { type: String, required: true },
 * Email: { type: String, required: true },
 * Birthday: Date,
 * FavMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
 * }
 */
let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: "Movie"}]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

// creates models for movies and users
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

// exports models to index.js
module.exports.Movie = Movie;
module.exports.User = User;