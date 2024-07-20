const mongoose = require("mongoose");
const Schema = mongoose.Schema ; 
const Review = require("./review.js");
const User = require("./user.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title : {
        type : String 
    },
    description :{
        type : String ,
    }, 
    image:{
        url :  String , 
        filename : String 
    } , 
    price:{
        type : Number ,
        set :(v) => v==""? 0 : v 
    },
    location : String , 
    country : String ,
    reviews : [
        {
            type : Schema.Types.ObjectId , 
            ref : "Review"
        }
    ] , 
    owner : {
        type : Schema.Types.ObjectId , 
        ref : "User"
    }, 
    category : {
        type : String ,
        enum : [ "Lake", "Rooms"  , "Mountain" , "Castles" , "Camping" , "Beach" , "Islands" , "Artic" , "Towers" , "Yurts" , "Surfing" , "TinyHomes"]  , 
    } , 
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
   
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing ; 