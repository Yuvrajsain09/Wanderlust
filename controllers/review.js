const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.reviewPost = async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review added successfully");

    res.redirect(`/listings/${listing._id}`);

};

module.exports.reviewDelete = async(req,res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //pull operator is used to remove the reviewId from the reviews array of the listing
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
};

