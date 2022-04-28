const router = require("../users/signIn");
var express = require('express');
var jwt = require('jsonwebtoken');
var db = require('../db');
var bodyParser = require('body-parser');
const { json } = require('body-parser');
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({extended: false})); // for parsing application/x-www-form-urlencoded
const Joi = require('joi');

// app.js  /adminproduct

router.get('/', function(req, res, next) 
{

  var sql = "SELECT * FROM products";
  db.query(sql, function(err, rows, fields) {
    if (err) {
      res.status(500).send({ error: 'Something failed!' })
    }

    
    res.json(rows)
  })
});



  /*post method for create product*/

  // app.js  /adminproduct

  router.post('/create', ensureToken, function(req, res, next) 
  {

    
  // fetch the request data
 const data = req.body;

 // define the validation schema
  const schema = Joi.object().keys({
 
 
      name: Joi.string().required(),
      description: Joi.string().required(),
      brand: Joi.string().required(),
      category: Joi.string().required(),
      retail: Joi.string().required(),
      color: Joi.string().required(),
 
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
            
            var name = req.body.name;
            var description = req.body.description;
            var brand = req.body.brand;
            var category = req.body.category;
            var retail = req.body.retail;
            var color = req.body.color;
            

            var sql = `INSERT INTO products (P_Name,Descripton,Brand_Name,Category_Name,Retail,Color) VALUES ("${name}", "${description}","${brand}","${category}","${retail}","${color}")`;
            db.query(sql, function(err, result) {
            if(err) 
            {
              res.status(500).send({ err })
            }
            res.json({'status': 'success'})
    })
    }
    }})   
  }
  })
  });
  
  /*Admin Updatng A Specific Product*/
  router.put('/update/:id', ensureToken, function(req, res, next) 
  {

       
  // fetch the request data
 const data = req.body;

 // define the validation schema
  const schema = Joi.object().keys({
 
 
      id: Joi.number().integer().min(1).max(2000),
      name: Joi.string().required(),
      description: Joi.string().required(),
      brand: Joi.string().required(),
      category: Joi.string().required(),
      retail: Joi.string().required(),
      color: Joi.string().required(),
 
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
          var name = req.body.name;
          var description = req.body.description;
          var brand = req.body.brand;
          var category = req.body.category;
          var retail = req.body.retail;
          var color = req.body.color;
       //   var size = req.body.size;
       //   var material = req.body.material;
          var sql = `UPDATE products SET  P_Name="${name}",Descripton="${description}",Brand_Name="${brand}",Category_Name="${category}",Retail="${retail}",Color="${color}" WHERE Id=${id}`;
            db.query(sql, function(err, result) {
            if(err) {
            res.status(500).send({ error: 'Something failed!' })
            }else
            {
             res.send({text:"Updated!"})
            }
     })
     }
    }})
      }
  }) 
  });
  
  /*delete method for delete product*/
  router.delete('/delete/:id', ensureToken, function(req, res, next) 
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
            var sql = `DELETE FROM products WHERE Id=${id}`;
            db.query(sql, function(err, result) {
            if(err) 
            {
               res.status(500).send({ error: 'Something failed!' })
            }
            res.json({'status': 'success'})
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

module.exports = router;