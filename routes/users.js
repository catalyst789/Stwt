const mongoose  = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost/sstw', {useNewUrlParser:true, useUnifiedTopology:true});

const userSchema = mongoose.Schema({
  name:String,
  username:String,
  email:String,
  password:String,
  tweets:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'tweets'
  }]
});

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema)