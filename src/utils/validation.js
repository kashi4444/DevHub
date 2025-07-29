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

const validateProfileEditData = (req)=>{
    const allowedEditFields =["firstName", "lastName","photoUrl","gender","age","about","skills"];
    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
    return isEditAllowed;
}

module.exports= {validateSignUpData, validateProfileEditData};