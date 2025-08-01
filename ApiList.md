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
-GET /user/requests/received
-GET /user/connnections
-GET /user/feed - Gets you the profile of other users on platform 

Status : ignore, interested, accepted, rejected


/feed?page=1&limit=10 => .skip(0) & .limit(10)

/feed?page=2&limit=10 => .skip(10) & .limit(10)

/feed?page=3&limit=10 => .skip(20) & .limit(10)