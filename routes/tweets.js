const mongoose = require('mongoose');

const tweetSchema = ({
    caption:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    date:{
        type:Date,
        default:new Date()
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
})

module.exports = mongoose.model('tweets', tweetSchema);
