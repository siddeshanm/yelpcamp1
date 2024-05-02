const mongoose = require('mongoose')
const Review = require('./review')
const opts = { toJSON: { virtuals: true } };
const imageSchema = new mongoose.Schema({
    url: String,
    name: String
});

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
});



const campgroundSchema = new mongoose.Schema({
    title: String,
    image:[imageSchema],
    price: Number,
    description:String,
    location: String,
    geoData:{
        type: {
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates :  {
            type: [Number],
            required : true
        }     
    },
    author : {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    reviews : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Review",
    }
    ]
}, opts)

campgroundSchema.virtual('properties.getMarkUp').get(function(){
    return `<strong><a href="campgrounds/${this._id}" >${this.title}</a> </strong>
            <p>${this.description.substring(0,15)}...</p>`;
})


campgroundSchema.post('findOneAndDelete', async function (data) {
    if(data){
        for(let reviewId of data.reviews){
            const review = await Review.findByIdAndDelete(reviewId)
        } 
    }
})
const Campground = mongoose.model('CampGround', campgroundSchema)

module.exports = Campground;