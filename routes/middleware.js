const WrapAsync = require('../utils/WrapAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campgrounds')
const { reviewSchema, campgroundSchema } = require('../schemas')
const Review = require('../models/review')
module.exports.isLoggedIn = (req, res, next) => {
 
    if(!req.isAuthenticated()){
      req.session.returnTo = req.originalUrl
      req.flash('error', 'You must be SignedIn !!')
      return res.redirect('/login')
    }
    next();
  }

module.exports.returnTo = (req, res, next) => {
  if(req.session.returnTo){
    res.locals.returnTo = req.session.returnTo
  }
  next()
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params
 const camp = await Campground.findById(id)
 if(!camp.author._id.equals(req.user._id)){
  req.flash("error", "You don't have permission to do that")
  return res.redirect(`/campgrounds/${camp._id}`)
 }
  next()
}

module.exports.valiadteCampground  = (req, res, next) => {
  const validatedData = campgroundSchema.validate(req.body)
  //console.log(validatedData)
  if(validatedData.error){
   throw new ExpressError(validatedData.error.details.map(el => el.message).join(','), 400)
  }else{
   next();
  }
}
module.exports.valiadteReview= (req, res, next) => {
  const validatedData = reviewSchema.validate(req.body)
  if(validatedData.error){
   throw new ExpressError(validatedData.error.details.map(el => el.message).join(','), 400)
  }else{
   next();
  }
}

module.exports.isAuthorOfReview = async (req, res, next) => {
  const { id, reviewId } = req.params
 const review = await Review.findById(reviewId)
  if(!review.author.equals(req.user._id)){
    req.flash("error", "You don't have permission to do that")
    return res.redirect(`/campgrounds/${id}`)
 }
  next()
}