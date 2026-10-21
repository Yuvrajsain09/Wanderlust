if(process.env.NODE_ENV != "production") {
require("dotenv").config();

}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate"); //to use ejs-mate for layouts and partials one layout file can be used for multiple pages
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const listingsrouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//const Mongo_URL = "mongodb://127.0.0.1:27017/waterlust";
const dbUrl= process.env.ATLASDB_URL;


main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

    



async function main() {
    await mongoose.connect(dbUrl);
}

app.engine("ejs", ejsMate); //to use ejs-mate for layouts and partials
// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price:1200,
//         location:"Calangute Goa",
//         country:"India"

//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:"thisshouldbeabettersecret"
    },
    touchAfter: 24*3600
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET, 
    resave: false, 
     saveUninitialized: false, // It helps avoid storing unnecessary empty sessions, reducing unnecessary session-store writes and supporting privacy-conscious session handling.
    cookie: {
        httpOnly: true, // to prevent client side js from accessing the cookie
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days 1000 is ms , 60 is mins , 60 is sec , 24 is hrs and 7 is days
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //this will use the authenticate method provided by passport-local-mongoose to authenticate the user

passport.serializeUser(User.serializeUser()); //this will use the serializeUser method provided by passport-local-mongoose to serialize the user seralize means store the user in the session and deserialize means retrieve the user from the session
passport.deserializeUser(User.deserializeUser()); //this will use the deserializeUser method provided by passport-local-mongoose to deserialize the user deserialize means retrieve the user from the session and serialize means store the user in the session


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // this will make the current user available in all the templates so that we can use it to show different nav bar links based on whether the user is logged in or not
    next();
});

// app.get("/demoUser", async (req, res) => {
//     let user = new User({ 
//         email: "demouser@example.com",
//         username: "demouser"
//      });
//     let registeredUser = await User.register(user, "password");
//     res.send(registeredUser);
// });

app.use("/listings", listingsrouter);
app.use("/listings/:id/reviews", reviewsrouter); 
app.use("/", userrouter); // this will handle all the routes related to user like register, login, logout etc
// if page not found
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrong" } = err;
    res.status(statusCode).send(message);
});
// use to handle err if wrong type of data is store in create route

 app.get("/", (req, res) => {
    res.redirect("/listings");
});
app.listen(8080, () => {
    console.log("server is listening on port 8080 ");
});



