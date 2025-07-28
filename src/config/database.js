const mongoose = require('mongoose');
const connectDB = async()=>{
    await mongoose.connect(
        "mongodb+srv://kashishagarwal594:dH0KyF0KVVwp5uUh@cluster0.syw9s.mongodb.net/devHub"
    )
}
module.exports  = connectDB;