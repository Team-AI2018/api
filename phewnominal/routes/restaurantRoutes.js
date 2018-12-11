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
  Restaurant.findById(req.params.id)
      .then((theRestaurant) => {
          res.json(theRestaurant);
      })
      .catch((err) => {
          res.json(err);
      })
})

router.post('/restaurants/add-new', (req, res, next) => {
  Restaurant.create({
    name: req.body.name,
    description: req.body.description,
    foodType: req.body.foodType,
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