const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");

authRouter.post("/signup", async(req,res)=>{
    try{
        //validate data
        validateSignUpData(req);
        const {firstName , lastName , email, password} = req.body;
    
        //encrypt password
        const passwordHash = await bcrypt.hash(password, 10);

        //create instance 
        const user = new User({
            firstName , 
            lastName , 
            email, 
            password : passwordHash
        });
        //save in DB
        await user.save();

        //send response
        res.send("User Added Successfully");
    }catch(err){ 
        res.status(400).send("ERROR: "+ err.message);
    }
    
})

authRouter.post("/login", async(req,res)=>{
    try{
        //fetch data
        const {email, password} = req.body;

        //find User
        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("User is not in DB");
        }

        //check password correct or not
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            //create a jwt token
            const token = await user.getJWT();

            //add the token to the cookie and send it back to the user
            res.cookie("token", token, {expires: new Date(Date.now() + 8 * 60 * 60* 1000)});

            //send response
            res.send("LoggedIn Successfull");
        }else{
            throw new Error("Password is incorrect");
        }
    }catch(err){ 
        res.status(400).send("ERROR: "+ err.message);
    }
})

authRouter.post("/logout", (req,res)=>{
    //just remove token and now you cannot access anything unless you login again
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    
    //send response
    res.send("LoggedOut Successfull");

})

module.exports = authRouter;
