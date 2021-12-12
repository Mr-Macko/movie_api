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
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
