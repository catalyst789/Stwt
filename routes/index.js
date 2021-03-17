var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModel = require('./users');
const tweetModel = require('./tweets');
const localStrategy = require('passport-local');
const { populate } = require('./users');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', sendToProfile, function(req, res) {
  res.render('index');
});

/* GET login page. */
router.get('/login',sendToProfile, function(req, res) {
  res.render('login');
});

/* GET profile page. */
router.get('/profile',isLoggedIn, function(req, res) {
  res.send('welcome to profile..!');
});

/* GET logout */
router.get('/logout', function(req, res) {
  req.logOut();
  res.redirect('/');
});




/* GET allTwwets ftom user */
router.get('/alltweets', function(req, res, next){
  tweetModel.find().populate('tweets').
  then(function(alltweets){
    res.send(alltweets);
  })
})

/*GET like a tweet*/
router.get('/likee/:aidee', function(req, res, next){
  userModel.findOne({username:req.session.passport.user})
  .then(function(foundUser){
    tweetModel.findOne({_id:req.params.aidee})
    .then(function(foundTweet){
      if(foundTweet.likes.indexOf(foundUser._id) === -1){
        foundTweet.likes.push(foundUser._id)
      }
      else{
        var ei = foundTweet.likes.indexOf(foundUser._id);
        foundTweet.likes.splice(ei, 1);
      }
      foundTweet.save().then(function(savedTweet){
        res.send(savedTweet);
      })
    })
  })
}) 




/* POST Registering User. */

router.post('/reg', function(req, res, next){
  const newUser = new userModel({
    name:req.body.name,
    username:req.body.username,
    email:req.body.email
  })
  userModel.register(newUser, req.body.password)
  .then(function(userRegistered){
    passport.authenticate('local')(req, res, function(){
      res.redirect('/profile');
    })
  })
  .catch(function(err){
    res.send(err);
  })
})

/* POST Login User. */
router.post('/login', passport.authenticate('local', {
  successRedirect:'/profile',
  failureRedirect:'/login'
}), function(req, res, next){ });


/* POST Creating Tweet by logged User */
router.post('/tweetKaro',isLoggedIn ,function(req, res, next){
  userModel.findOne({username:req.session.passport.user})
  .then(function(userFound){
    tweetModel.create({
      caption:req.body.caption,
      user:userFound
    }).then(function(newlyCreatedTweet){
      userFound.tweets.push(newlyCreatedTweet);
      userFound.save().then(function(savedUser){
        res.send(savedUser);  
      })
    })
  })
})





function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/login');
  }
}

function sendToProfile(req, res, next){
  if(req.isAuthenticated()){
    res.redirect('/profile');
  }
  else{
    return next();
  }
}

module.exports = router;
