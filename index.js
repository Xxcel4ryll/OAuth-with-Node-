const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
const dotenv = require("dotenv").config();
const passportSetup = require("./controllers/main.control");
const app = express();

mongoose
  .connect(process.env.MONGODB_CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MONGODB Connected.."))
  .catch((err) => console.log(err.message));

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./routes/main.routes.js"));

app.get("/", (req, res) => {
  res.send("Home Page");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
