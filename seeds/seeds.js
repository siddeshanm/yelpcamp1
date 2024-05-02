const mongoose = require('mongoose')
const Campground = require('../models/campgrounds')
const names = require('./seedHelpers')
const cities = require('./cities')



main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp', { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('SUCCESSFULLY CONNECTED TO DB')
}

const sample = array => array[Math.floor(Math.random() * array.length)] ; 

const seedDb = async function () {
    await Campground.deleteMany({});

    for(let i = 0 ; i < 200 ;i++){
        let rand1 = Math.floor(Math.random() * 1000);
        const title = `${sample(names.descriptors)} ${sample(names.places)}`
        const price = Math.floor(Math.random() * 400 )+ 20;
        const image =[];
         image.push({
            url : 'https://res.cloudinary.com/dlmcyunks/image/upload/v1697527746/yelpCamp/cjntrbt6tregoy8su5ov.jpg',
            name : 'yelpCamp/cjntrbt6tregoy8su5ov'
        })
        const camp = new Campground({

            title: title, location: `${cities[rand1].city}, ${cities[rand1].state}`,
            image,
            description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus blanditiis dignissimos consectetur pariatur temporibus maxime corporis fugiat nemo, soluta ad minima dolor sed aut, ipsa repudiandae est deserunt voluptate.",
            price : price,
            author: "65251a15cab6543c368e292c",
            geoData:  { type: 'Point', coordinates: [cities[rand1].longitude , cities[rand1].latitude ] }
        })
        await camp.save()
    }
}

seedDb().then(() =>{
    mongoose.connection.close()
})
