//server is created
const express = require('express');

//new app created
const app = express();


app.use("/hello", (req, res)=>{
    res.send("Hello Hello Hello!")
})
app.use("/test", (req, res)=>{
    res.send("Hello from the server!")
})
app.use("/", (req, res)=>{
    res.send("Hello from the dashboard!")
})
//app is listening or running on port 3000
app.listen(7777, ()=>{
    console.log("Server is successfully listening on port 7777..");
});