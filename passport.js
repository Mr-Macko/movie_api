// requiers passport
const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./modals.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;
// ***passport strategies***
// LocalStrategy
passport.use(new LocalStrategy({usernameField: 'Username',
passwordField: 'Password'
}, (username, password, callback) => {
    console.log(username + ' ' + password);
    Users.findOne({Username: username }, (error, user) => {
        if(error){
            console.log(error);
            return callback(error);
        }

        if(!user){
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username or password.'});
        }
        
        console.log('finished');
        return callback(null, user);
    });
}));
