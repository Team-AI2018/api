const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');

const User = require('../models/userModel');

const passport = require('passport');


router.post('/signup', (req, res, next) => {
    // console.log('signup', req.body)
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username }, (err, foundUser) => {
        if(err){
            res.status(500).json({message: "Username check went bad."});
            return;
        }
        if (foundUser) {
            res.status(400).json({ message: 'Username taken. Choose another one.' });
            return;
        }
        const salt     = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);
  
        const aNewUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username:username,
            password: hashPass,
            email: req.body.email

        });
        aNewUser.save(err => {
            if (err) {
                res.status(400).json({ message: 'Saving user to database went wrong.' });
                return;
            }
            req.login(aNewUser, (err) => {

                if (err) {
                    res.status(500).json({ message: 'Login after signup went bad.' });
                    return;
                }
                res.json(aNewUser);
            });
        });
    });
});

    router.post('/login', (req, res, next) => {
        // console.log('login', req.body)
        passport.authenticate('local', (err, theUser, failureDetails) => {
            if (err) {
                res.json({ message: 'Something went wrong authenticating user' });
                return;
            }
            if (!theUser) {
                // console.log("did not log in HAHAHAAHAHAHA!");
                res.json(failureDetails);
                return;
            }
            req.login(theUser, (err) => {
                if (err) {
                    res.json({ message: 'Session save went bad.' });
                    return;
                }
                // console.log(theUser)
                res.json(theUser);
            });
        })(req, res, next);
});

    router.post('/logout', (req, res, next) => {
        req.logout();
        res.json({ message: 'Log out success!' });
    });
    router.get('/loggedin', (req, res, next) => {
        if (req.isAuthenticated()) {
            res.json(req.user);
            return;
        }
        res.status(500).json({ message: 'Unauthorized' });
    });



module.exports = router;
