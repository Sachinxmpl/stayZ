if (process.env.NODE_ENV != "production") {
  require('dotenv').config()
}

const express = require("express");
const app = express();
const port = 9000;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");



const session = require("express-session");
const MongoStore = require('connect-mongo');


const flash = require("connect-flash");


const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js")



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));


let dbUrl = process.env.MongoAtlasDbUrl  //skipped
async function main() {
   mongoose.connect(dbUrl);
}
main()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));



const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})


const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expired: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};



app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});





//listings
app.use("/listings", listings);

//reviews
app.use("/listings/:id/reviews", reviews);

//users
app.use("/", userRouter)

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "This is DEFAULT error message " } = err;
  res.status(statusCode).render("./lists/error.ejs", { error: err });
});


app.listen(port, () => {
  console.log(`Listings to port ${port}`);
});
