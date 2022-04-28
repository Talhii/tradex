//const router = require("../users/signIn");
const Joi = require('joi');
var express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
var db = require('../db');
var bodyParser = require('body-parser');
const { json } = require('body-parser');
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({extended: false})); // for parsing application/x-www-form-urlencoded



// ADMIN Getting A List Of Buyers

//  app.js   /adminbuyer

router.get('/all',ensureToken,(req,res)=>
{
       jwt.verify(req.token,'my_secret_key',function(err,data){{
       if(err)
        {
            res.status(403).send({ error: 'Access Denied' })
        }else
        {
            var sql = `SELECT * FROM customers WHERE Status = "Buyer"`;
            db.query(sql, function(err, result) {
            if(err) 
            {
              res.status(500).send({ err })
            }
            res.json({result})
    })
    }
    }})   


});


// Getting A Specific Buyer

router.get('/:id',ensureToken,(req,res,next)=>
{

// fetch the request data
 const data = req.body;

// define the validation schema
 const schema = Joi.object().keys({


     id: Joi.number().integer().min(1).max(2000),

    

 });

 // validate the request data against the schema
 Joi.validate(data, schema, (err, value) => {

     // create a random number as id
     //const id = Math.ceil(Math.random() * 9999999);

     if (err) {
         // send a 422 error response if validation fails
         res.status(422).json({
             status: 'error',
             message: 'Invalid request data',
             data: data
         });
     } else {


 // else part

    
    jwt.verify(req.token,'my_secret_key',function(err,data){{

        if(err)
        {
            res.status(403).send({ error: 'Access Denied' })
        }else
        {
           
          var id = req.params.id;
          var sql = `SELECT * FROM customers WHERE Id=${id}`;
          db.query(sql, function(err, row, fields) {
          if(err) 
          {
              res.status(500).send({ error: 'Something failed!' })
          }
          
          res.json(row)
        })
        }
        }})   
    }
    })

});


//   Not Working

//  Deleting A Buyer
router.delete('/delete/:id',ensureToken,(req,res)=>
{


// fetch the request data
const data = req.body;

// define the validation schema
 const schema = Joi.object().keys({


     id: Joi.number().integer().min(1).max(2000),

    

 });

 // validate the request data against the schema
 Joi.validate(data, schema, (err, value) => {

     // create a random number as id
     //const id = Math.ceil(Math.random() * 9999999);

     if (err) {
         // send a 422 error response if validation fails
         res.status(422).json({
             status: 'error',
             message: 'Invalid request data',
             data: data
         });
     } else {


 // else part

    jwt.verify(req.token,'my_secret_key',function(err,data){{
        if(err)
        {
            res.status(403).send({ error: 'Access Denied' })
        }
        else
        {
            var id = req.params.id;
            var sql = `DELETE FROM customers WHERE Id=${id}`;
            db.query(sql, function(err, result) {
              if(err) {
                res.status(500).send({ error: 'Something failed!' })
              }
            //  res.json({'status': 'success'})
              res.send({message:"Deleted"})
              
            })
        
        }
        }}) 
    }
     })    
});


function ensureToken(req,res,next){
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined")
    {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else {
        res.sendStatus(403);

    }
}

module.exports = router ;