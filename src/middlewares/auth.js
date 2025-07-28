const AdminAuth = (req,res, next)=>{
    const token ="xyz";
    const isAuthenticated = token === "xyz";
    if(!isAuthenticated){
        res.status(401).send("Unauthorized User");
    }else{
        next();
    }
};    
const UserAuth = (req,res, next)=>{
    const token ="xytz";
    const isAuthenticated = token === "xyz";
    if(!isAuthenticated){
        res.status(401).send("Unauthorized User");
    }else{
        next();
    }
};    

module.exports = {AdminAuth,UserAuth};