const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')

// creating chats
const accessChat = asyncHandler(async(req,res)=>{
    const {userId} = req.body;

    if(!userId){
        res.status(401)
        throw new Error("userId param not sent with req")
    }

    // if the chat exist with this user or not
    var isChat = await Chat.find({

        // $and -- should satisfy both requirements
        $and:[
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}}
        ]
    }).populate('users','-password').populate('latestMessage')

    isChat = await User.populate(isChat,{
        path:'latestMessage.sender',
        select: 'name pic email'
    });
    if(isChat.length>0){
        return res.json(isChat[0])
    } 
    //if not exist then create 
    else{
        var chatData={
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id,userId]
        }
        try {
            const createdChat = await Chat.create(chatData)

            const fullChat = await Chat.findOne({_id: createdChat._id}).populate('users','-password')
            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})

// fetching chats for particular user(loggedIn user)
const fetchChat = asyncHandler(async(req,res)=>{
    try {
        Chat.find({users:{$elemMatch: {$eq: req.user._id}}})
              .populate('users','-password')
              .populate('groupAdmin','-password')
              .populate('latestMessage')
              .sort({updatedAt:-1})
              .then(async(result)=>{
                await User.populate(result,{
                    path:'latestMessage.sender',
                    select: 'name pic email'
                });
                res.status(200).send(result)
              })
    } catch (error) {
        res.status(400)
            throw new Error(error.message)
    }
})

// creating group chat
const createGroupChat= asyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send("Please fill all the fields")
    }

    var users = JSON.parse(req.body.users) //all users
    if(users.length<2){
        return res.status(400).send("Minimum 2 members are required to make a group chat.")
    } 
    users.push(req.user) //me

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat : true,
            groupAdmin: req.user
        })

        // fetching all chats 
        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
                            .populate('users','-password')
                            .populate('groupAdmin','-password')

        res.status(200).send(fullGroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

// renaming group
const renameGroup=asyncHandler(async(req,res)=>{
    const {chatId,chatName} = req.body;
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName
            },
            {
                new: true
            }
        ).populate('users','-password')
         .populate('groupAdmin','-password')

         if(!updatedChat){
            res.status(400)
            throw new Error('Chat not found')
         } else{
            res.send(updatedChat)
         }
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

// adding users to group
const addToGroup = asyncHandler(async(req,res)=>{
    const {chatId,userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {$push: {users: userId}},
        {new: true}
    ).populate('users','-password')
     .populate('groupAdmin','-password')

    if(!added){
        res.status(400)
        throw new Error("User could not be added")
    } else{
        res.send(added)
    }
})
// removing users to group
const removeFromGroup = asyncHandler(async(req,res)=>{
    const {chatId,userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {$pull: {users: userId}},
        {new: true}
    ).populate('users','-password')
    .populate('groupAdmin','-password')

    if(!added){
        res.status(400)
        throw new Error("User could not be added")
    } else{
        res.send(added)
    }
})

module.exports = {accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup}