const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    firstName:{
        type : String,
        required: true,
        minLength : 4,
        maxLength : 50
    },
    lastName :{
        type: String,
    },
    email:{
        type: String,
        required:true,
        lowercase: true,
        trim:true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email id"+ value);
            }
        }
    },
    password :{
        type: String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password" + value);
            }
        }
    },
    age:{
        type : Number,
        min: 18
    },
    gender:{
        type: String,
        validate(value){
            if(!["male", "female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default :"https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg"
    },
    about:{
        type: String,
        default:"This is a default about of the user"
    },
    skills:{
        type:[String],
    }
},{
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);