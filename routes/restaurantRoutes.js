const express = require('express');
const router  = express.Router();
const Restaurant    = require('../models/restaurantModel');

router.get('/restaurants', (req, res, next) => {
  Restaurant.find()
      .then((allTheRestaurants) => {
          res.json(allTheRestaurants)
      })
      .catch((err) => {
          res.json(err);
      })
});

router.get('/restaurants/details/:id', (req, res, next) => {
    // console.log('details', req.params)
  Restaurant.findById(req.params.id)
      .then((theRestaurant) => {
        //   console.log(theRestaurant)
          res.json(theRestaurant);
      })
      .catch((err) => {
          //console.log(err)
          res.json(err);
      })
})

router.post('/restaurants/add-new', (req, res, next) => {
  Restaurant.create({
    name: req.body.name,
    description: req.body.description,
    foodType: req.body.foodType,
     location: req.body.location,
    avgPrice: req.body.avgPrice,
    rating: req.body.rating,
    owner: req.user._id

      })
      .then((response) => {
          res.json(response);
      })
      .catch((err) => {
          res.json(err);
      })
})

router.post('/restaurants/edit/:id', (req, res, next) => {
  Restaurant.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    foodType: req.body.foodType,
    location: req.body.location,
    avgPrice: req.body.avgPrice,
    rating: req.body.rating,
      })
      .then((response) => {
          if (response === null) {
              res.json({
                  message: 'sorry we could not find this restaurant'
              })
              return;
          }
          res.json([{
                      message: 'this task has been successfully updated'
                  },
                  response
              ])
      })
      .catch((err) => {
          res.json(err)
      })
})

router.post('/restaurants/delete/:id', (req, res, next) => {
    console.log(req.user, req.body) //to look at logged in user
    //the owner of this id 
    if(req.user._id != req.body.owner){
        return res.json({
            message: 'your not the owner'
        })
    }

  Restaurant.findByIdAndRemove(req.params.id)
      .then((deletedRestaurant) => {
          if (deletedRestaurant === null) {
              res.json({
                  message: 'sorry we could not find this restaurant'
              })
              return;
          }
          res.json([{
                  message: 'restaurant succesfully deleted'
              },
              deletedRestaurant
          ])
      })
      .catch((err) => {
          res.json(err)
      })
})





module.exports = router;