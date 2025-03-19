const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Set up Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });
      
      // If user exists, return the user
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with the same email
      if (profile.emails && profile.emails.length > 0) {
        const email = profile.emails[0].value;
        user = await User.findOne({ email });
        
        if (user) {
          // User exists with this email, link the Google ID to this account
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }
      }
      
      // Create a new user
      const username = profile.displayName.toLowerCase().replace(/\s/g, '') + 
                       Math.floor(Math.random() * 1000);
      
      const newUser = new User({
        googleId: profile.id,
        email: profile.emails ? profile.emails[0].value : '',
        username: username,
        first: profile.name ? profile.name.givenName : '',
        last: profile.name ? profile.name.familyName : '',
        profilePicture: profile.photos && profile.photos.length > 0 
                        ? profile.photos[0].value 
                        : "/default_profile.jpg"
      });
      
      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      console.error("Google auth error:", err);
      return done(err, null);
    }
  }
));

module.exports = passport;