const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListings } = require("../middleware.js");
const listingController = require("../controller/listings.js")

const multer  = require("multer")
const {storage} = require("../cloudconfig.js")

const upload = multer({storage})



//Get ans post request on /listings
router.route("/").get(
  wrapAsync(listingController.index)
)
.post(isLoggedIn,
  upload.single("listing[image]") , 
  validateListings,
  wrapAsync(listingController.createListing)
);


  // .post( upload.single("listing[image]"), (req,res)=>{
  //     console.log(req.body)
  //     res.send(req.file)
  // })

 



//new and create route
router.get("/new", isLoggedIn, listingController.newListingForm);


router.get("/search", wrapAsync(listingController.searchListingThroughLocation))

//show route
router.route("/:id")
  .get(
    wrapAsync(listingController.showListing)
  )
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]") , 
    validateListings,
    wrapAsync(listingController.editListing)
  )
  .delete (
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);


//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm)
);


module.exports = router;
