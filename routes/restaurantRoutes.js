const express = require('express');
const router  = express.Router();
const Restaurant    = require('../models/restaurantModel');
const yelp = require('yelp-fusion');
const apiKey = "p9DUdMWqeE_Kt6rgKTr-937X5EjLB24wNr0FO9QgCd2WwwUVhZcCClTjCjdrg65U2skbdoadwKNZ7xK8zVSmJbSEH6L7XgdDH3HeAE6LVlBvN3Uwhwtg_S7tDVYZXHYx"
const client = yelp.client(apiKey);
const Reviews    = require('../models/reviewModel');


router.get('/restaurants', (req, res, next) => {

    console.log(req.query)

  Restaurant.find()
      .then((allTheRestaurants) => {

        client.search({
            term:req.query.q, //make these variables 
            location: req.query.location || 'miami fl' //this one too zip code? 

          }).then(response => {

            let obj = {
                allTheRestaurants:allTheRestaurants,
                yelp:response.jsonBody
            }
            console.log(obj)
            //res.json(allTheRestaurants)
            res.json({obj:obj})

          }).catch(e => {
            console.log(e);
          });
          
      })
      .catch((err) => {
          res.json(err);
      })
});



router.get('/restaurants/details/:id', (req, res, next) => {
    // console.log('details', req.params)
    Reviews.find({restId: req.params.id}).then((reviews)=>{

        Restaurant.findById(req.params.id)
        .then((theRestaurant) => {
            // console.log(theRestaurant)
            // theRestaurant.reviews = reviews;
            let obj = {
                theRestaurant: theRestaurant,
                reviews: reviews
            }
            res.json(obj);
        })
        .catch((err) => {
            //console.log(err)
            res.json(err);
        })
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

    Restaurant.findById(req.params.id)
    .then((theRestaurant)=>{

        if(!req.user._id.equals(theRestaurant.owner)){
                return res.json({
                    message: 'your not the owner'
                })
            }

// console.log('cnjshdcjsdjcbjsbjccnjshdcjsdjcbjsbjccnjshdcjsdjcbjsbjccn',req.user._id, theRestaurant.owner)
        Restaurant.findByIdAndRemove(theRestaurant._id)
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
    .catch((err)=>{
        // console.log(err)
    })
    
    









    //the owner of this id 
    // if(req.user._id !== req.body.owner){
    //     return res.json({
    //         message: 'your not the owner'
    //     })
    // }

  
})





module.exports = router;