
const User = require('../models/user')

module.exports.getRegisterForm = (req, res) => {
    res.render('user/register')
}

module.exports.createUser = async (req, res, next) => {
    try{
      const { email, password, username} = req. body
      const user =  new User({email,username})
      const registeredUser = await User.register(user, password)
      req.login(registeredUser, err => {
        if (err) { return next(err); }
        req.flash('success','Welcome to Yelp Camp!')
        res.redirect('/campgrounds')
      });
    }catch(err){
      req.flash('error', err.message)
      res.redirect('/register')
    }
  }
module.exports.getLoginForm =  (req, res) => {
    res.render('user/login')
}
module.exports.login= (req, res) => {

    req.flash('success', "Welcome Back !!")
    const redirectUrl =  res.locals.returnTo  || "/campgrounds"
    res.redirect(redirectUrl)
}

module.exports.logout =  (req, res, next) => {
    req.logout( function(err) {
      if (err) { return next(err); }
      req.flash('success', "Good Bye !!")
      res.redirect('/campgrounds');
})}
