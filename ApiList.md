# DevHub APIs

## authRouter
-POST /signup
-POST /login
-POST /logout

## profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/forgotPassword    //forgot password
-PATCH /profile/changePassword    //change password

## connectionRequestRouter
-POST /request/send/:status/:userId       //for interested and ignored 
-POST /request/review/:status/:requestId      //for accepted and rejected

## userRouter
-GET /user/connnections
-GET /user/requests
-GET /user/feed - Gets you the profile of other users on platform 

Status : ignore, interested, accepted, rejected
