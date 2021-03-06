const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req,res,next) => {
    Product
    .find()
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc =>{
                return{
                    name : doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products' + docs.id
                    }
                }
            })
        }

        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
});

router.post('/', (req,res,next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    product
    .save()
    .then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price:result.price,
                _id: result.id,
                request:{
                    type:'GET',
                    url: "http://localhost:3000/products" + result.id
                }
            }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    });

    
    });
});


router.get('/:productID', (req,res,next) =>{
    const id = req.params.productID;
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            console.log("From database",doc);
            if (doc){
                res.status(200).json(doc);
            } else{
                res.status(404).json({message: 'No valid entry found for provided IP'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
});

router.patch('/:productID', (req,res,next) =>{
    // new update
    const id = req.params.productID;
    Product.findByIdAndUpdate(id, { $set: req.body }, { new: true})
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({ error: err}))
})

router.delete('/:productID', (req,res,next) =>{
    const id = req.params.productID;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
})




module.exports = router;
