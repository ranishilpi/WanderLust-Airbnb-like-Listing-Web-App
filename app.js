if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}


// app.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./models/user'); // Import User model

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const MONGO_URL = "mongodb://localhost:27017/wanderlust";
//const dbUrl = process.env.ATLASDB_URL;
//const MONGO_URL = dbUrl || "mongodb://localhost:27017/wanderlust";

// DB Connection
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

// EJS + Middleware
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  touchAfter: 24 * 60 * 60, // time period in seconds
  crypto: {
    secret: "mysupersecretcode"
  }
});

store.on("error", (e) =>  {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  store,
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true
  }
};

// ---------------------- ROUTES ---------------------- //

// Home
// app.get("/", (req, res) => {
  // res.send("Hello, I am root");
// });

app.use(session(sessionOptions)); 
app.use(flash());
// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
// Serialize and deserialize user
// This is used to store user info in the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user; // req.user is set by passport
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser=req.user;
  next();
});

//  USE LISTING ROUTER
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ---------------------- ERRORS ---------------------- //
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// ----------------------
// ERROR HANDLING MIDDLEWARE
// ----------------------
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;

    // If no message, give a default one
    if (!err.message) err.message = "Something went wrong!";

    // MOST IMPORTANT PART → pass error to EJS
    //res.status(statusCode).render("error", { error: err });
    res.status(statusCode).render("error", { err });
});


// Start server
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
