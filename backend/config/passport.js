const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback",
    proxy: true
}, async(accessToken, refreshToken, profile, done) => {
    try {
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
            return done(null, existingUser);
        }

        // Check if same email exists with a password login → update it
        existingUser = await User.findOne({ email: profile.emails[0].value });
        if (existingUser) {
            existingUser.googleId = profile.id;
            await existingUser.save();
            return done(null, existingUser);
        }

        // New user
        const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id
        });

        done(null, newUser);
    } catch (err) {
        done(err, null);
    }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/api/auth/facebook/callback",
    profileFields: ["id", "displayName", "emails"]
}, async(accessToken, refreshToken, profile, done) => {
    try {
        let existingUser = await User.findOne({ facebookId: profile.id });

        if (existingUser) {
            return done(null, existingUser);
        }

        // Check if user with same email exists
        //   const email = profile.emails?.[0]?.value || '';


        existingUser = await User.findOne({ email });

        if (existingUser) {
            existingUser.facebookId = profile.id;
            await existingUser.save();
            return done(null, existingUser);
        }

        const newUser = await User.create({
            name: profile.displayName,
            email: email,
            facebookId: profile.id
        });

        done(null, newUser);
    } catch (err) {
        done(err, null);
    }
}));