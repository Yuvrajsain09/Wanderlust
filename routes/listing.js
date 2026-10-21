const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer( { storage }); 

//index route


router
    .route("/")
    //Index
    .get(wrapAsync(ListingController.index))
    //Create Route
    .post(isLoggedIn, upload.single("listing[image]"),
     wrapAsync(ListingController.CreateListing)
     );

//New Route isko hm show route se uper rkhenge bcoz agr neeche rkhe then server new ko id smjhleta hai
router.get("/new", isLoggedIn, ListingController.NewForm);

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.EditForm)
);



router
    .route("/:id")
    // Show route
    .get(wrapAsync(ListingController.ShowRoute))
    // here validateListing is passing as a middleware

    //update route
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing , wrapAsync(ListingController.UpdateRoute))


    //Delete Route
    .delete(isLoggedIn, isOwner, wrapAsync(ListingController.DeleteRoute));


router.get("/:id/edit", (req, res) => {
    console.log("Route hit!", req.params);
    res.send("Edit route working");
});


module.exports = router;
