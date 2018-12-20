const express = require('express');
const router  = express.Router();
const Restaurant    = require('../models/restaurantModel');
const Reviews = require("../models/reviewModel");


router.get('/restaurants/:id/reviewDetails', (req, res, next)=>{
  Reviews.findById(req.params.id)
      .then((theReviews) => {
        console.log("*****************************", theReviews);
          res.json(theReviews)
      })
      .catch((err) => {
          res.json(err);
      })
})

router.post('/restaurants/:id/reviewDetails', (req, res, next)=>{
  Reviews.findByIdAndUpdate(req.params.id, req.body)
      .then((theReviews) => {
        console.log("*****************************", theReviews);
          res.json(theReviews)
      })
      .catch((err) => {
          res.json(err);
      })
})

router.get('/restaurants/:id/addReview', (req, res, next)=>{
  Restaurant.findById(req.params.id)
  .then((theRestaurant)=>{
    res.json({theRestaurant: theRestaurant})
  })    
})

router.post('/restaurants/:id/addReview', (req, res, next)=>{
  console.log('i hit this crap', req.params, req.body, req.user)
  Reviews.create({
    author: req.user.username,
    rating: req.body.rating,
    review: req.body.review,
    restId: req.params.id
  })
  .then(createdReview => {

    console.log('in here', createdReview)
    res.json(createdReview)
    /*Restaurant.findById(req.params.id) 
      .then(restaurantFromDB => {
        restaurantFromDB.reviews.push(createdReview._id)
        restaurantFromDB.save()
        .then(response => {
          res.json(response)
        })
        .catch(err => {
          next(err);
        })
      })
      .catch(err => {
        next(err);
      })*/
  }).catch(err => {
    next(err);
  })
})

router.get('/restaurants/:id/edit',isLoggedIn, (req, res, next)=>{
  Reviews.findById(req.params.theIdThing)
  .then((theReview)=>{
    canEdit = false
      console.log(req.user, theReview )
    if(String(req.user.username === String(theReview.author))){
      console.log(req.user, theReview )
      canEdit = true
     }
   res.json({theReview: theReview, canEdit: canEdit})
  })
  .catch((err)=>{
      next(err);
  })
});

router.post('/restaurants/:id/update', (req, res, next)=>{
  Reviews.findByIdAndUpdate(req.params.id,  {rating: req.body.rating, review: req.body.review})
  .then((response)=>{
      res.json(response)
  })
  .catch((err)=>{
      next(err)
  })
})
router.post('/restaurants/:id/delete', (req, res, next)=>{
  Reviews.findByIdAndRemove(req.params.id)
  .then((response)=>{
      res.json(response)
  })
  .catch((err)=>{
      next(err);
  })
})


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/')
}
module.exports = router;