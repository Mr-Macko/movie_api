// requiers passport
const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./modals.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;
