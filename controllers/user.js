const User = require("../models/user.js");

 module.exports.Signup = (req, res) => {
    res.render("./user/signup.ejs")
 };


 module.exports.Signuppost = async (req, res) => {
 try {
     let { username, email, password } = req.body;
     const newUser = new User({ username, email });
     const registeredUser = await User.register(newUser, password);
     req.login(registeredUser, (err) => {
         if (err) {
             return next(err);
         }
         req.flash("success", "Welcome to Wanderlust! You have successfully signed up.");
     res.redirect("/listings");
     });
   
 } catch (e) {
     req.flash("error", e.message);
     res.redirect("/signup");
 }
 };


 module.exports.login = (req, res) => {
    res.render("./user/login.ejs");
}

module.exports.loginpost = async (req, res) => {
        req.flash("login successful");
        let redirectUrl = res.locals.redirectUrl || "/listings"; // get the redirectUrl from res.locals or default to /listings
        res.redirect(redirectUrl); // redirect to the page the user was trying to access before being redirected to login page or to the listings page if there is no redirectUrl

    };



module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
           return next(err);
        }    
        req.flash("success", "You have successfully logged out.");
        res.redirect("/listings");
    });
}