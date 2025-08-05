//create server
const express = require('express');
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
const cors = require('cors');

//create app
const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//import all the routers 
const authRouter = require('./router/auth');
const profileRouter = require('./router/profile');
const requestRouter = require('./router/requests');
const userRouter = require('./router/user');

//now activating routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen((7777), ()=>{
        console.log("Server is listening at port 7777");
    })
}).catch((err) => {
    console.log("Database cannot be connected");
});

