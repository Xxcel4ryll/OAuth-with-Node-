const express = require("express");
const passport = require("passport");
const { authClean, privateProperty } = require("../controllers/main.control");
const router = express.Router();

router.get("/login", (req, res) => {
  console.log("Login");
  res.send("LOgin");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/dashboard", authClean, privateProperty);

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  privateProperty
);

module.exports = router;
