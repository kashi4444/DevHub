const express = require('express');
const userRouter = express.Router();

const {UserAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

//get all the pending connection requests for the loggedIn User
userRouter.get("/user/requests/received", UserAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        
        const allConnectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age","gender", "about", "skills"]);
        res.json({
            message : "All requests has been fetched successfully", 
            data : allConnectionRequests
        })

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

userRouter.get("/user/connnections", UserAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or:[
                {fromUserId : loggedInUser._id, status : "accepted"},
                {toUserId : loggedInUser._id , status : "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        //to get only the data of the fromUser
        const data = connections.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        //send response
        res.json({
            message: "Connections fetched successfully",
            data : data
        })
    }catch(err){ 
        res.status(400).send("ERROR: " + err.message);
    }
})

userRouter.get("/user/feed", UserAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page -1) * limit;

        //get all my connections
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((request)=> {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        })

        //find person who are not in this list along with remove ourself also
        //and do not send the critical data like password
        const users = await User.find({
            $and:[
                {_id :{ $nin: Array.from(hideUsersFromFeed) }},
                {_id : { $ne : loggedInUser._id } }
            ]
            
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        //send response
        res.json({data: users});
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
})
module.exports = userRouter;