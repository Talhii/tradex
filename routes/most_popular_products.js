var express = require('express');
var router = express.Router();
var db = require('../db');
var bodyParser = require('body-parser');
const Joi = require('joi');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({extended: false})); // for parsing application/x-www-form-urlencoded

/* Getting All Most Popular Products */

//  app.js    /mostPopularProducts

router.get('/', function(req, res, next) {
  var sql = "SELECT * FROM most_popular_products";
  db.query(sql, function(err, rows, fields) {
    if (err) {
      res.status(500).send({ error: 'Something failed!' })
    }

    
    res.json(rows)
  })
});


/* Getting Most Popular Product By Id*/
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
    var sql = `SELECT * FROM most_popular_products WHERE Id=${id}`;
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
 router.post('/create',ensureToken ,function(req, res, next) 
 {
      
  // fetch the request data
 const data = req.body;

 // define the validation schema
  const schema = Joi.object().keys({
 
      
      pname: Joi.string().required(),
      description: Joi.string().required(),
      brandName: Joi.string().required(),
      catname: Joi.string().required(),
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
  


    var pname = req.body.pname;
    var description = req.body.description;
    var brandName= req.body.brandName;
    var catname = req.body.catname;
    var retail = req.body.retail;
    var color = req.body.color;
  
    var sql = `INSERT INTO most_popular_products (P_Name,Description,Brand_Name,Category_Name,Retail,Color) VALUES ("${pname}", "${description}","${brandName}", "${catname}","${retail}", "${color}")`;
    db.query(sql, function(err, result) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
     res.json({'status': 'success'})
    })

  }
  })

  });
  
  /*put method for update product*/
 router.put('/update/:id',ensureToken ,function(req, res, next) 
 {
   
  // fetch the request data
 const data = req.body;

 // define the validation schema
  const schema = Joi.object().keys({
 
      
      pname: Joi.string().required(),
      description: Joi.string().required(),
      brandName: Joi.string().required(),
      catname: Joi.string().required(),
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
      } 
      else 
      {
   // else part
    var id = req.params.id;
    var pname = req.body.pname;
    var description = req.body.description;
    var brandName= req.body.brandName;
    var catname = req.body.catname;
    var retail = req.body.retail;
    var color = req.body.color;

  
    var sql = `UPDATE most_popular_products SET  P_Name=${pname},Description=${description},Brand_Name=${brandName},Category_Name=${catname},Retail=${retail},Color=${color} WHERE Product_Id=${id}`;
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
      }
      })
  });
  
  /*delete method for delete product*/
  router.delete('/delete/:id',ensureToken ,function(req, res, next) {
    var id = req.params.id;
    var sql = `DELETE FROM most_popular_products WHERE Id=${id}`;
    db.query(sql, function(err, result) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json({'status': 'deleted'})
    })
  })
  
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
  