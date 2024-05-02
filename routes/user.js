const express = require('express')
const router = express.Router()
const User = require('../models/user')
const WrapAsync = require('../utils/WrapAsync')
const passport = require('passport')
const { returnTo } = require('./middleware')
const users = require('../controllers/users')


router.route('/register')
.get(users.getRegisterForm)
.post(WrapAsync ( users.createUser));

router.route('/login')
.get(users.getLoginForm)
.post(returnTo, passport.authenticate('local', { failureFlash : true, failureRedirect : '/login'}), users.login);

router.get('/logout', users.logout)

module.exports = router