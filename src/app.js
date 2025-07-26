//server is created
const express = require('express');

//new app created
const app = express();

app.get("/user/:userId/:name/:password", (req, res)=>{
    console.log(req.params);
    res.send("Got it");
});
//app is listening or running on port 3000
app.listen(7777, ()=>{
    console.log("Server is successfully listening on port 7777..");
});