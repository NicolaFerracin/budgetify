const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(User.createStrategy());

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_KEY,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:8080/auth/facebook/callback',
  profileFields: ['id', 'name', 'emails']
},
  function (token, refreshToken, profile, done) {
    process.nextTick(function () {
      User.findOne(
        { $or: [{ 'facebook.id': profile.id }, { 'email': profile.emails[0].value }] },
        function (err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            let name;
            if (profile.name.givenName) {
              if (profile.name.familyName) {
                name = `${profile.name.givenName} ${profile.name.familyName}`
              } else {
                name = profile.name.givenName
              }
            }
            newUser.name = name;
            newUser.email = profile.emails[0].value;
            newUser.save(function (err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        })
    })
  }
));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_APP_KEY,
  clientSecret: process.env.GOOGLE_APP_SECRET,
  callbackURL: 'http://localhost:8080/auth/google/callback'
},
  function (token, refreshToken, profile, done) {
    process.nextTick(function () {
      User.findOne(
        { $or: [{ 'google.id': profile.id }, { 'email': profile.emails[0].value }] },
        function (err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.name = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.save(function (err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
    })
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
