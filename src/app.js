//create server
const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
//create app
const app = express();

app.post("/signup", async(req,res)=>{
    //create instance 
    const user = new User({
        firstName: "Sunil",
        lastName :"Kohli",
        email:"Virat@ag.com",
        password:"Virat@123",
        _id: "123"
    })
    try{
        user.save();
        res.send("User Added Successfully");
    }catch(err){
        res.status(400).send("Error in saving the message: "+ err.message);
    }
    
})


connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen((7777), ()=>{
        console.log("Server is listening at port 7777");
    })
}).catch((err) => {
    console.log("Database cannot be connected");
});

