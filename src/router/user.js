const express = require('express');
const userRouter = express.Router();

const {UserAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

//get all the pending connection requests for the loggedIn User
userRouter.get("/user/requests/received", UserAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        
        const allConnectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status: "interested"
        })
        res.json({
            message : "All requests has been fetched successfully", 
            data : allConnectionRequests
        })

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = userRouter;