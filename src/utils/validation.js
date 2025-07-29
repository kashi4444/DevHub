const validator = require('validator');

const validateSignUpData =(req)=>{
    const {firstName , lastName , email, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Nme is not valid");
    }else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password");
    }
}

module.exports= {validateSignUpData};