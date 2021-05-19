const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user");
// const dotenv = require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/redirect",
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken);
      await ControlRoom.validateUser(profile)
        .then(async (user) => {
          // console.log("SECOND BLOCK");
          if (!user._json || user._json == null) {
            console.log("wITHout _json");
            done(null, user);
          } else {
            return await ControlRoom.createUser(user);
          }
        })
        .then(async (result) => {
          if (result) {
            done(null, result);
          }
        })
        .catch((err) => console.log(err.message));
    }
  )
);

class ControlRoom {
  static privateProperty(req, res) {
    res.send(`Hello ${req.user.fullName}`);
  }

  static authClean(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect("/auth/login");
    }
  }

  static async createUser(user) {
    try {
      const { name, sub, email } = user._json;
      // console.log(name, sub, email);
      if (!name || !sub || !email) return console.log("Invalid credentials");

      const newUser = new User({
        fullName: name,
        email: email,
        googleID: sub,
      });
      const savedUser = await newUser.save();
      return savedUser;
    } catch (err) {
      console.log(err.message);
    }
  }

  static async validateUser(profile) {
    try {
      const user = await User.findOne({
        googleID: profile.id,
      });
      if (user) {
        console.log("FROM MONGODB " + user);
        return user;
      }
      console.log("FIRST BLOCK");
      return profile;
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = ControlRoom;
