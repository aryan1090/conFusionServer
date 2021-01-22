var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
const authenticate  = require('../authenticate');
const cors = require('./cors');
const user = require('../models/user');

var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */

router.options('*',cors.corsWithOptions,(req,res)=>{res.sendStaus(200)})


router.get('/', authenticate.verifyUser,authenticate.verifyAdmin,function(req, res, next) {
  User.find()
  .then((users)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(users);
  },(err)=>next(err))
  .catch((err)=>next(err));
});

router.post('/signup',function(req,res,next){
  User.register(new User({username:req.body.username}),req.body.password
  ,(err,user)=>{
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    }
    else{
      if(req.body.firstname)
        user.firstname = req.body.firstname;
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err,user)=>{
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type','application/json');
          res.json({err:err});
          return;
        }
        passport.authenticate('local')(req,res,()=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({success:true,status:'Registration Successful!',user:user});
        });
      });
    }
  })
});


router.post('/login',cors.corsWithOptions,(req,res,next)=>{
  passport.authenticate('local',(err,user,info)=>{
    if(err){
      return next(err);
    }

    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type','application/json');
      res.json({success:false,status:'Login unsuccessful',err:info});
  
    }
    req.logIn(user,(err)=>{
      if(err){
        res.statusCode = 401;
        res.setHeader('Content-Type','application/json');
        res.json({success:false,status:'Login unsuccessful',err:'Could not log in user'});
      }
      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json({success:true,token:token,status:'You are successfully logged in!',user:req.body.username});
    })

  })(req,res,next);
})

router.get('/logout',(req,res,next)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error('you are not logged in!');
    err.status = 403;
    next(err);
  }
})

router.get('/facebook/token',passport.authenticate('facebook-token'),(req,res)=>{
  if(req.user){
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

router.get('/checkJWTToken',cors.corsWithOptions,(req,res,next)=>{
  passport.authenticate('jwt',{session:false},(err,user,info)=>{
    if(err){
      return next(err);
    }
    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type','applicarion/json');
      res.json({status:'JWT invalid!',success:false,err:info});
    }
    else{
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json({status:'JWT valid!',success:false,user:user});    }
  })(req,res);
})

module.exports = router;