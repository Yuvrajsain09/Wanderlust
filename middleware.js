const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema , reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // this will store the url the user was trying to access before being redirected to login page so that we can redirect them back to that url after they login   
        req.flash("error", "You must be signed in to create a new listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // this will make the redirectUrl available in all the templates so that we can use it to redirect the user back to the page they were trying to access after they login
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "Listing that you are trying to access does not belong to you");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.validateListing = (req,res,next) => {
          
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
}


module.exports.validateReview = (req,res,next) => {
          
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
         next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id , reviewId } = req.params;
    let review = await Review.findByIdAndUpdate(id, { reviewId });
    if (!review_id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You can't edit this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};