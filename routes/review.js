const express = require("express")
const router = express.Router({mergeParams : true})
const wrapAsync = require("../utils/wrapAsync")
const Listing = require("../models/listing")
const Review = require("../models/review.js")
const { validateReviews, isLoggedIn , isreviewAuthor } = require("../middleware.js")

router.post(
  "/",
  isLoggedIn , 
  validateReviews,
  wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id 
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    req.flash("success","New review created")
    res.redirect(`/listings/${req.params.id}`)
  })
)

router.delete(
  "/:reviewId", isreviewAuthor , 
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params
    await Review.findByIdAndDelete(reviewId)
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash("success","Review deleted successfully")
    res.redirect(`/listings/${req.params.id}`)
  })
)
module.exports = router
