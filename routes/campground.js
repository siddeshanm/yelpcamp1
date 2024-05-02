const express = require('express')
const app = express()
const router = express.Router({ mergeParams : true})
const { campgroundSchema } = require('../schemas')
const WrapAsync = require('../utils/WrapAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campgrounds')
const flash = require('connect-flash')
const { isLoggedIn, isAuthor, valiadteCampground } = require('./middleware')

const multer  = require('multer')
const { storage } = require('../cloudinary/index')


const campgrounds = require('../controllers/campgrounds')

const upload = multer({storage})


router.route('/')
.get(WrapAsync (campgrounds.allCampgrounds))
 .post(isLoggedIn,upload.array('image'),valiadteCampground, WrapAsync (campgrounds.createForm))


router.get('/new', isLoggedIn, campgrounds.renderNewForm)
router.get('/:id/edit', isLoggedIn, isAuthor, WrapAsync (campgrounds.editForm))

router.route('/:id')
 .get(WrapAsync(campgrounds.showCampgrounds))
 .put(isLoggedIn, isAuthor, upload.array('image'), valiadteCampground, WrapAsync(campgrounds.editCampgrounds))
 .delete(isLoggedIn, isAuthor, WrapAsync (campgrounds.destroyCampgrounds))



module.exports = router