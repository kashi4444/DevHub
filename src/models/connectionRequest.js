const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required : true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required : true
    },
    status:{
        type: String,
        enum :{
            values: ["interested", "ignored", "accepted", "rejected"],
            message :`{VALUE} is incorrect status type`
        },
        required : true
    }
},{
    timestamps: true
});

connectionRequestSchema.index({fromUserId: 1, toUserId : 1});

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Connection Request cannot be send to yourself");
    }
    next();
})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);