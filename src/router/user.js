const express = require('express');
const userRouter = express.Router();

const {UserAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
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
module.exports = userRouter;