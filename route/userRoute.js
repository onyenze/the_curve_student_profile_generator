const express = require('express');
const router = express.Router();

const {
    registration,
    logIn,
    signOut,
    changePassword,
    forgotPassword,
    resetPassword,
    updateUsers,
    getUserProfile,
    registration2
} = require('../controller/userController')
const {
    userAuth,
} = require('../middlewares/authMiddleware')
const { validationMiddleware } = require("../middlewares/validator");
const { validateUser } = require("../middlewares/updateUservalidator");
const { passwordMiddleware } = require("../middlewares/passwordValidator");




// Major Routes for Normal USERS
// router.post('/signup',validationMiddleware, registration)  // checked
router.post('/signups', registration2) 
router.post('/login', logIn) //checked
router.put('/logout/:id',  userAuth, signOut) // checked
router.put('/changepassword/:id', userAuth,changePassword) // checked
router.post('/changepassword/:id/:token',passwordMiddleware, resetPassword) // checked
router.post('/forgotpassword', forgotPassword) // checked

router.put('/updateuser',  userAuth, validateUser,updateUsers) // checked


// GET request to get all event reviews
router.get('/getUserProfile',userAuth,getUserProfile);



module.exports = router;

