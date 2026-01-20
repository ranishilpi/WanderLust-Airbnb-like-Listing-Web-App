const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');

const userController = require("../controllers/users");

// Route to render user registration form
// router.get('/signUp', userController.renderSignupForm);
// 
// router.post('/signUp', wrapAsync(userController.signup));
// 
//Route to render user login form
// router.get('/login', userController.renderLoginForm);
// 
// router.post('/login', saveRedirectUrl, passport.authenticate('local', { 
    // failureRedirect: '/login',
    // failureFlash: true,
// }), 
// userController.login
// );
// 
// router.get("/logout", userController.logout);
// 
// module.exports = router;

router.route("/signup")
.get(userController.renderSignupForm )
.post(wrapAsync(userController.signup))

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}), userController.login
) 

// logout 
router.get("/logout", userController.logout);
module.exports = router;
