const express = require('express');
const requestRouter = express.Router();
const {UserAuth} = require("../middlewares/auth");

requestRouter.post("/sendConnectionReq",UserAuth ,async(req,res)=>{
    const user = req.user;
    console.log("Connection Request has been sent");
    res.send("Connection Request has been sent by " + user.firstName);
})

module.exports = requestRouter;  