console.log(process.env.NODE_ENV)
//console.log(process.env)
if (process.env.NODE_ENV !== "production"){
  require('dotenv').config()
}



const express = require('express')
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const ExpressError = require('./utils/ExpressError')
const engine = require('ejs-mate')
const session = require('express-session')
const joi =  require('joi')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')
const { isLoggedIn } = require('./routes/middleware')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const MongoStore = require('connect-mongo')(session)

const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/review')
const userRoutes = require('./routes/user')
const port = process.env.PORT || 3000


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({extended : true }))
app.use(methodOverride('_method'))
app.engine('ejs', engine)
app.use(express.static( path.join(__dirname, 'public')))
app.use(mongoSanitize({allowDots: true, replaceWith: '_',}),);
app.use(helmet({contentSecurityPolicy : false}));
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com",
  "https://api.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://kit.fontawesome.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://cdn.jsdelivr.net",
  "https://kit-free.fontawesome.com",
  "https://stackpath.bootstrapcdn.com",
  "https://api.mapbox.com",
  "https://api.tiles.mapbox.com",
  "https://fonts.googleapis.com",
  "https://use.fontawesome.com",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
];
const connectSrcUrls = [
  "https://api.mapbox.com",
  "https://*.tiles.mapbox.com",
  "https://events.mapbox.com",
];
const fontSrcUrls = [];


const dbUrl = process.env.DB_URL
//
//'mongodb://127.0.0.1:27017/yelpCamp'
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          childSrc: ["blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dlmcyunks/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://images.unsplash.com",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

const store = new MongoStore({
  url:dbUrl,
  secret : 'thisismysecret',
  touchAfter : 24 * 3600
})

  
store.on("error", (e) => {
  console.log("SESSION STORE ERROR")
  console.log(e)
})

const sessionConfig = {
   store,
   name:"session",
   secret : 'thisismysecret',
   resave : false ,
   saveUninitialized : true,
   cookie : {
    httpOnly : true,
    //secure:true,
    expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge : 1000 * 60 * 60 * 24 * 7
   }
   
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))



passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());


main().catch(err => console.log(err));
//

async function main() {
  await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('SUCCESSFULLY CONNECTED TO DB')
}


app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.whoUser = req.user
  next();
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
  
    res.render('home')
})

app.all('*', (req, res, next) => {
  next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
  const{ status = 500} = err
  if(!err.message)  err.message = "Something Went Wrong!!!!"
  res.status(status).render('error', {err})
})

app.listen(port, () => {
    console.log("Hey I'M Listening to 3000")
})