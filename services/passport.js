const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

// import the user model from mongoDB
const User = mongoose.model("users");

// passport takes the instance of user and saves the id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// mongoDB takes the id from passport and uses it to find the full user entry in the DB
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

// utilize passport's GoogleStrategy to get the user's google account info and set our mongoDB user's googleId to that user's google profile id through OAuth and save the user
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);
