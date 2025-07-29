const express = require('express');
const profileRouter = express.Router();
const {UserAuth} = require("../middlewares/auth");
const {validateProfileEditData} = require("../utils/validation");
const bcrypt = require('bcrypt');
const validator = require('validator');

profileRouter.get("/profile/view",UserAuth, async(req,res)=>{ 
    try{
        //find user
        const user = req.user;  

        //send response
        res.send(user);
    }catch(err){ 
        res.status(400).send("ERROR: "+ err.message);
    }
})

profileRouter.patch("/profile/edit", UserAuth, async(req,res)=>{
    try{
        //validate the data
        if(!validateProfileEditData(req)){
            throw new Error("Invalid Edit Request");
        }

        //find user whose data is to be update
        const loggedInUser = req.user;

        //update only the required filds
        Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]));

        //save the changes to DB
        await loggedInUser.save();

        //send response
        res.json({
            message : `${loggedInUser.firstName}, your profile is updated successfully`,
            data : loggedInUser
        });

    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
})

profileRouter.patch("/profile/changePassword", UserAuth, async(req, res)=>{
    try{
        //fetch data 
        const {oldPassword, newPassword} = req.body;
    
        //find existing user
        const existingUser = req.user;
        const hashedCurrPassword = existingUser.password;

        //match old password with the password in the DB
        const isPasswordCorrect = await bcrypt.compare(oldPassword, hashedCurrPassword);
        if(!isPasswordCorrect){
            throw new Error("Old password do not match");
        }

        //check new password is strong or not
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Enter a strong password");
        }
        const newHashedPassword = await bcrypt.hash(newPassword,10);
        existingUser.password = newHashedPassword;

        //save in DB
        await existingUser.save();

        //send response
        res.send("Password changed successfully");

    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
    



})
module.exports = profileRouter;