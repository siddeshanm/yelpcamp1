const Review = require('../models/review')
const Campground = require('../models/campgrounds')

module.exports.createReview = async (req, res, next) => {
    const { id } = req.params;
    const review = new Review(req.body)
    review.author = req.user._id
    const camp = await Campground.findById(id);
    camp.reviews.push(review)
    await review.save()
    await camp.save()
    req.flash('success', "Succesfully Added a Review")
    res.redirect(`/campgrounds/${id}`)
  }

module.exports.destroyReview = async (req, res, next) => {
    const {id, reviewId} = req.params
    const camp = await Campground.findByIdAndUpdate(id,{ $pull : {reviews : reviewId}})
    const review = await Review.findByIdAndDelete(reviewId)
    req.flash('success', "Succesfully Deleted Review")
   res.redirect(`/campgrounds/${id}`)
}