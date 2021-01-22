
const express = require('express');
const bodyParser = require('body-parser');
const Promos = require('../models/promotions');
const authenticate  = require('../authenticate');
const cors  = require('./cors');
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get(cors.corsWithOptions,(req,res,next)=>{
    Promos.find(req.query)
    .then((promos)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promos);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promos.create(req.body)
    .then((dish)=>{
        console.log('Dish Created ',dish);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on Promotions');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promos.deleteMany({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
});



promoRouter.route('/:promoId')
.get((req,res,next)=>{
    Promos.findById(req.params.promoId)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('Post operation not supported on /promotions/'+req.params.promoId);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promos.findByIdAndUpdate(req.params.promoId,{ $set: req.body },{ new: true })
    .then((promo)=>{
        console.log('Promotion Created ',promo);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promos.findByIdAndRemove(req.params.promoId)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

module.exports = promoRouter;