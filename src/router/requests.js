const express = require('express');
const requestRouter = express.Router();
const {UserAuth} = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", UserAuth ,async(req,res)=>{
    try{
        //fetch data
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        
        //validate the data
        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type: " + status});
        }

        //check toUser exist or not in your DB
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message : "User not found"});
        }

        //check if already this connection request exist or not 
        //if A->B connection has been sent then B->A will not sent
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId : fromUserId , toUserId : toUserId},
                {fromUserId : toUserId , toUserId : fromUserId}
            ]
        });
        if(existingConnectionRequest){
            return res.status(400).json({message : "This Connection Request already exists"});
        }

        //create an instance
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        //save in DB
        const data = await connectionRequest.save();

        //send response
        res.json({
            message : `${req.user.firstName} ${status} Connection Request of ${toUser.firstName}`,
            data: data,
        });


    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", UserAuth , async(req, res)=>{
    try{
        const loggedInUser = req.user;
        //requestId is the id of connection request between sender and receiver
        const {status , requestId} = req.params;
        
        //validate the status 
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            res.status(400).json({ messa: "Status not allowed"});
        }

        //check whether this connection request exists or not
        //fromUserId => toUserId
        //loggedIn must be toUserId
        //status = interested
        //requestId should be valid
        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested",
        })
        if(!connectionRequest){
            return res.status(404).json({ message : "Connection Request Not Found"});
        }
        
        //update and save changes in DB
        connectionRequest.status = status;
        const data = await connectionRequest.save();

        //send response
        res.send({ message : "Connection Request "+ status, data :data});
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})
module.exports = requestRouter;