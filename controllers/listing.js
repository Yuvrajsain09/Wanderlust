const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKENS;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.NewForm = (req, res) => {

    res.render("listings/new.ejs");
};

module.exports.ShowRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing that you are looking for does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });

};

module.exports.CreateListing = async (req, res) => {
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        }
        )
        .send();




    let url = req.file.path;
    let filename = req.file.filename;



    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; //assigning the owner of the listing to the logged in user
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "Successfully made a new listing");
    res.redirect("/listings");

};

module.exports.UpdateRoute = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id, { ...req.body.listing }); //deconstruct the req.body.listing

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        Listing.image = { url, filename };
        let savedListing = await listing.save();
    }

    req.flash("success", "Successfully updated the listing");
    res.redirect(`/listings/${id}`);
};


module.exports.DeleteRoute = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("deletedListings");
    req.flash("success", "Successfully deleted the listing");
    res.redirect(`/listings`);
};

module.exports.EditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("You are not the owner of this Post")
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });

};