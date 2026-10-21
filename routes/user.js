const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userOwner = require("../controllers/user.js"); // User controller



router
    .route("/signup")
    .get(userOwner.Signup)
    .post(
        wrapAsync(userOwner.Signuppost)
    );


router
    .route("/login")
    .get(userOwner.login)
    .post(saveRedirectUrl,
        passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
        wrapAsync(userOwner.loginpost)


    );

// Route: Handles POST requests at /login.

// passport.authenticate('local'):

// Uses the local strategy (username + password).

// Middleware checks credentials against the database.

// Options:

// { failureRedirect: '/login' } → If login fails, user goes back to /login.

// Success case:

// If login succeeds, callback runs → res.redirect('/') (user goes to homepage).

// 3. Flow
// User submits login form → POST /login.

// Passport checks credentials using LocalStrategy.

// If invalid → redirect to /login.

// If valid → user session created → redirect to /.

// 4. Key Points
// Passport middleware simplifies authentication.

// failureRedirect helps handle wrong credentials gracefully.

// After success, you can redirect anywhere (dashboard, profile, etc.).

// Session management is handled by Passport + Express session.

router.get("/logout", userOwner.logout);
module.exports = router;