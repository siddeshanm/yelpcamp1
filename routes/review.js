const express = require('express')
const app = express()
const router = express.Router({ mergeParams : true})
const { reviewSchema } = require('../schemas')
const WrapAsync = require('../utils/WrapAsync')
const ExpressError = require('../utils/ExpressError')
const Review = require('../models/review')
const Campground = require('../models/campgrounds')
const { valiadteReview, isLoggedIn,  isAuthorOfReview } = require('../routes/middleware')
const reviews = require('../controllers/reviews')





router.post('/', isLoggedIn, valiadteReview, WrapAsync(reviews.createReview))
  
  
router.delete('/:reviewId', isLoggedIn, isAuthorOfReview, WrapAsync(reviews.destroyReview))
  

  module.exports = router