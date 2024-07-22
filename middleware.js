const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user)
  // console.log(req.path, "--", req.originalUrl)
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please login first to create listing ");
    return res.redirect("/login");
  }
  next()
}


module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next()
}


module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let testlisting = await Listing.findById(id)
  if (!testlisting.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You have no rights to change the listings")
    return res.redirect(`/listings/${id}`)
  }
  next()
}


module.exports.validateListings = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    // let errMsg = error.details.map((el)=> el.message.join(","))
    // throw new ExpressError(400, errMsg);
    throw new ExpressError(400 , error)
  } else {
    next();
  }
};

module.exports.validateReviews = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body)
  if (error) {
    throw new ExpressError(400, error)
  } else {
    next()
  }
}

module.exports.isreviewAuthor = async(req,res,next) =>{
  let {id , reviewId} = req.params 
  let testReview = await Review.findById(reviewId)
  if(!testReview.author._id.equals(res.locals.currUser._id)){
    req.flash("error" , "Only review creator can alter the review")
    return res.redirect(`/listings/${id}`)
  }
  next()
}