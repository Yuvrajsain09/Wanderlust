const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");



const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        ref: "Review"
    },
    image: {
        filename: String,
        url: String
    },
    price: {
        type: Number,

    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // coordinates: {
//      type: [Number],
//      ref: 'User',
//     require: true
// } // there is a better way than this which is geojson we use it bcz it have more inbuilt function which is following

 geometry: {
    type: {
    type:String , //Don't do `{location: {type: String}}`
    enum: ['Point'], // 'Location.type' must be 'Point'
    required:true
    },

    coordinates: {
        type: [Number],
        required: true
    }
}
 
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } }); //in is use for checking if the review id is present in the reviews array of the listing and if it is present then delete that review from the reviews collection
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;