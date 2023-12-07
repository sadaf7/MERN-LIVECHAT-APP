const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const generateToken = require('../config/generateToken')

// Creating User
const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password,pic} = req.body;
    
        if(!name || !email || !password){
            res.status(400);
            throw new Error("Fill all fields");
        }
        // Check for existing user in the database
        let userExists = await User.findOne({ email });
        if(userExists){
            res.status(400)
            throw new Error("User already exists");
        }
        // Create new user 
        const user = await User.create({
            name,
            email,
            password,
            pic
        })
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            })
        } else{
            res.status(400)
            throw new Error("User not created")
        }
})

// Users Login
const authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email})

    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    } else{
        res.status(400)
        throw new Error("Invalid email or password")
    }
})

// All users
const allUsers = asyncHandler(async(req,res)=>{
    const key = req.query.search ? {
        $or: [
          {name: {$regex: req.query.search, $options:'i'}}, 
          {email: {$regex: req.query.search, $options:'i'}}
        ],
    }:{};

    const user = await User.find(key).find({_id:{$ne: req.user._id}})
    // find({_id:{$ne: req.user._id}}) -- except current login user
    res.send(user)

})


module.exports = {registerUser,authUser,allUsers}