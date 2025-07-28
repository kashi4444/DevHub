//create server
const express = require('express');
const connectDB = require("./config/database");

//create app
const app = express();
const User = require("./models/user");

app.use(express.json());

//get a user data by email
app.get("/user", async(req,res)=>{
    const userEmail = req.body.email;
    try{
        const user = await User.find({email: userEmail});
        res.send(user);
    }catch(err){
        res.status(400).send("user not found");
    }
    
})
//to get all the users
app.get("/feed",async(req, res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(400).send("user not found");
    }
})

app.delete("/delete", async(req,res)=>{
    const userId = req.body.userId;
    try{
        await User.findByIdAndDelete(userId);
        res.send("User Deleted Successfully");
    }catch(err){
        res.status(400).send("user not Deleted");
    }
})
//update
app.patch("/user/:userId", async(req,res)=>{
    const userId = req.params.userId;
    const data = req.body;

    try{
        const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills"];
        const isUpdateAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            res.status(400).send("Update Not Allowed");
        }

        if(data?.skills.length > 10){
            throw new Error("Skills cannot be more than 10");
        }

        await User.findByIdAndUpdate(userId, data, {
            returnDocument:"after",
            runValidators:true
        });
        res.send("Details updated successfully");
    }catch(err){
        res.status(400).send("user not updated"+ err.message);
    }
})
app.post("/signup", async(req,res)=>{
    //create instance 
    const user = new User(req.body);
    try{
        await user.save();
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

