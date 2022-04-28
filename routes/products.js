var express = require('express');
var router = express.Router();
var db = require('../db');
var bodyParser = require('body-parser');
const Joi = require('joi');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({extended: false})); // for parsing application/x-www-form-urlencoded

/* get method for fetch all products. */

//  App.js   /allProducts
router.get('/', function(req, res, next) {
  var sql = "SELECT * FROM products";
  db.query(sql, function(err, rows, fields) {
    if (err) {
      res.status(500).send({ error: 'Something failed!' })
    }

    
    res.json(rows)
  })
});


/*get method for fetch single product*/
router.get('/:id', function(req, res, next) 
{

             
// fetch the request data
 const data = req.params;

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




    var id = req.params.id;
    var sql = `SELECT * FROM products WHERE Id=${id}`;
    db.query(sql, function(err, row, fields) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json(row[0])
    })
      }
  })
  });
  


  /*post method for create product*/
/**  router.post('/create', function(req, res, next) {
    var id = req.body.id;
    var name = req.body.name;
  //  var price = req.body.price;
  
    var sql = `INSERT INTO products (Product_Id, Product_Name) VALUES ("${id}", "${name}")`;
    db.query(sql, function(err, result) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
     res.json({'status': 'success'})
    })
  });
  
  /*put method for update product*/
 /** router.put('/update/:id', function(req, res, next) {
    var id = req.params.id;
    var name = req.body.name;
    //var sku = req.body.sku;
    //var price = req.body.price;
  
    var sql = `UPDATE products SET Product_Id="${id}", Product_Name="${name}" WHERE Product_Id=${id}`;
    db.query(sql, function(err, result) {
      if(err) {

        //console.log(err);
       res.status(500).send({ error: 'Something failed!' })
      }else
      {
        res.send({text:"Updated!"})
      }
     // res.json({'status': 'success'})
    })
  });
  
  /*delete method for delete product*/
/**  router.delete('/delete/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = `DELETE FROM products WHERE Product_Id=${id}`;
    db.query(sql, function(err, result) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json({'status': 'success'})
    })
  })
  
  */
  module.exports = router;
  