const express = require("express");
const router = express.Router({mergeParams: true}); //mergeParams is used to access the params of the parent route in this case the id of the listing
const wrapAsync = require("../utils/wrapasync.js");
const { validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewOwner = require("../controllers/review.js"); //review controller


//post the review
router.post("/", isLoggedIn, validateReview ,wrapAsync(reviewOwner.reviewPost)
);

// Delete Route for reviews
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewOwner.reviewDelete)
);

module.exports = router;