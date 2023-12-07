const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatControllers");
const router = express.Router()

// ROUTE: 1 -- creating chat---only loggedIn user
router.route('/').post(protect,accessChat)

// ROUTE: 2 -- fetching chats for particular user(loggedIn user)
router.route('/').get(protect,fetchChat)

// ROUTE:3 -- creating groupChat
router.route('/group').post(protect,createGroupChat)

// ROUTE:4 -- renaming groupChat
router.route('/rename').put(protect,renameGroup)

// ROUTE:5 -- adding users to group
router.route('/groupadd').put(protect,addToGroup)

// ROUTE:6 -- removing users from group
router.route('/groupremove').put(protect,removeFromGroup)



module.exports = router;