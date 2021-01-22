const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
const authenticate = require('../authenticate');

var Favorites = require('../models/favorite');
var Users = require('../models/user');


favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{ res.sendStatus(200);})
.get(cors.corsWithOptions,(req,res,next)=>{
    Favorites.find({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorites);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({user:req.user._id},(err,favorite)=>{
        if(err){
            return next(err);
        }
        if(favorite==null){
            Favorites.create({user:req.user._id,dishes:req.body})
            .then((favorite)=>{
                console.log("Favorite Created!");
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);
            },(err)=>next(err))
            .catch((err)=>next(err))
        }
        else{
            for(i=0;i<req.body.length;i++){
                if(favorite.dishes.indexOf(req.body[i]._id)==-1){
                    favorite.dishes.push(req.body[i]._id);
                }
            }
            favorite.save()
            .then((favorite)=>{
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite)=>{
                    res.StatusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                })
                
            })
            .catch((err)=>next(err))
        }

    })
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.setHeader('Content-Type','application/json');
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favourite.findOneAndRemove({user:req.user._id},(err,resp)=>{
        if(err){
            return next(err);
        }
        else{
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
        }
    });
    
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{ res.sendStatus(200);})
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({user:req.user._id})
    .then((favorites)=>{
        if(!favorites){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            return res.json({"exists":false,"favorites":favorites});
        }
        else{
            if(favorites.dishes.indexOf(req.params.dishId)<0){
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                return res.json({"exists":false,"favorites":favorites});
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                return res.json({"exists":true,"favorites":favorites});
            }
        }
    },(err)=>next(err))
    .catch((err)=>{
        return next(err);
    })
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({user:req.user._id},(err,favorite)=>{
        if(err){
            return next(err);
        }
        if(!favorite){
            Favorites.create({user:req.user._id})
            .then((favorite)=>{
                favorite.dishes.push({"_id":req.params.dishId})
                favorite.save()
                .then((favorite)=>{
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite)=>{
                        res.StatusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favorite);
                    })
                    
                })
                .catch((err)=>next(err))
            })
            .catch((err)=>next(err))
        }
        else{
            if(favorite.dishes.indexOf(req.params.dishId)<0){
                favorite.dishes.push({"_id":req.params.dishId});
                favorite.save()
                .then((favorite)=>{
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite)=>{
                        res.StatusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favorite);
                    })
                    
                })
                .catch((err)=>next(err));
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type','text/plain');
                console.log("Dish alreADY IN db");
                res.end('Dish '+ req.params.dishId + ' already exists');
            }
        }
    });
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.setHeader('Content-Type','text/plain');
    res.end('PUT operation not supported on /favorite '+ req.params.dishId);
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({user:req.user._id},(err,favorite)=>{
        if(err) return next(err);

        var index = favorite.dishes.indexOf(req.params.dishId);
        if(index>=0){
            favorite.dishes.splice(index,1);
            favorite.save()
            .then((favorite)=>{
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite)=>{
                    res.StatusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                })
            
            })
            .catch((err)=>{
                return next(err);
            })
        }
        else{
            res.statusCode = 404;
            res.setHeader('Content-Type','text/plain');
            res.end('Dish '+ req.params._id + ' not in your favorite dishes');
        }
    });
});


module.exports = favoriteRouter;