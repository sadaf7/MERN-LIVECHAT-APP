const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const JWT_SEC = "sdsadsdsads";

const protect = asyncHandler(async(req,res,next)=>{
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]

            // decode token id
            const decoded = jwt.verify(token,JWT_SEC)
            req.user = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            res.status(401)
            throw new Error('Invalid Token')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('Invalid Token')
    }
})

module.exports = {protect}