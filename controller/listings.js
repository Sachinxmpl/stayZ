const Listing = require("../models/listing");


const mbxClient = require('@mapbox/mapbox-sdk');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapaccesstoken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapaccesstoken });


module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({}).populate("owner");
  res.render("lists/index.ejs", { alllistings });
}


module.exports.newListingForm = (req, res) => {
  res.render("lists/new.ejs");
}


module.exports.searchListingThroughLocation = async (req, res) => {

    let location = req.query.location;
    let alllistings = await Listing.find({ location })
    res.render("lists/index.ejs" ,{alllistings} )
  
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  }).populate("owner")

  if (!listing) {
    req.flash("error", "No such listing was found");
    res.redirect("/listings");
  }
  res.render("lists/show.ejs", { listing });
}


module.exports.createListing = async (req, res, next) => {
  let Georesponse = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send()

  const url = req.file.path
  const filename = req.file.filename
  const newlisting = new Listing(req.body.listing);

  newlisting.owner = req.user._id
  newlisting.image = {
    url, filename
  }
  newlisting.geometry = Georesponse.body.features[0].geometry
  await newlisting.save();

  req.flash("success", "New listing created ");
  res.redirect("/listings");
}


module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesnot exists anymore");
    res.redirect("/listings");
  }

  let originalUrl = listing.image.url;
  newurl = originalUrl.replace("/upload", "/upload/h_230,w_300");
  res.render("edit/edit.ejs", { listing, newurl });
}



module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let testlisting = await Listing.findByIdAndUpdate(id, { ...req.body.listing });


  if (typeof (req.file) !== "undefined") {
    let url = req.file.path
    let filename = req.file.filename
    testlisting.image = {
      url,
      filename
    }
    await testlisting.save()
  }

  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
}



module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedList = await Listing.findByIdAndDelete(id);
  if (!deletedList) {
    req.error("error", "Listing doesnot exists anymore");
    res.redirect("/listings");
  } else {
    req.flash("success", "Listing deleted successfully");
  }
  res.redirect("/listings");
}