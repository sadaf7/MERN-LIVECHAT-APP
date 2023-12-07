const express = require("express");
const router = express.Router()
const {registerUser,authUser, allUsers} = require('../controllers/userControllers');
const { protect } = require("../middleware/authMiddleware");


// ROUTE:1
router.route('/').get(protect,allUsers)
router.route('/').post(registerUser).get(protect,allUsers)

// ROUTE:2
router.post('/login', authUser)




module.exports = router;