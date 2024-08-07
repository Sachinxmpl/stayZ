const Joi = require("joi")

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().valid(
            "Lake", "Rooms", "Mountain", "Castles", "Camping", "Beach", "Islands", "Arctic", "Towers", "Yurts", "Surfing", "TinyHomes"
        ).required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("")
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(0).max(5)

    }).required()
})
