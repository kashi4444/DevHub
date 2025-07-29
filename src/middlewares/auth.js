const jwt = require('jsonwebtoken')
const User = require("../models/user");
const UserAuth = async(req,res, next)=>{
    try{
        //read the token from req cookies
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not valid");
        }
        //validate the token
        const decodedObj = await jwt.verify(token, "Dev@Hub$19");
        const {_id} = decodedObj;
        //find the user
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User Not Found");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(404).send("ERROR: "+ err.message);
    }

};    

module.exports = {UserAuth};