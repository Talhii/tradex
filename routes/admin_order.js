var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var db = require('../db');
var bodyParser = require('body-parser');
const { json } = require('body-parser');
const Joi = require('joi');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({extended: false})); // for parsing application/x-www-form-urlencoded


//    Getting the List of all Orders


//   app.js    /adminorder

/**router.get('/all',ensureToken,(req,res)=>
{
    jwt.verify(req.token,'my_secret_key',function(err,data){{
        if(err)
        {
           // res.sendStatus(403);
           res.status(403).send({ error: 'Access Denied!' })
        }else
        {
          var sql = `SELECT * FROM orders`;
          db.query(sql, function(err, row, fields) {
            if(err) 
            {
              res.status(500).send({ error: 'Something failed!' })
            }
            console.log(row)
            res.json(row)
          })
        
        }
    }})
});
*/

//   Getting A Speciific Order

//  app.js  /adminorder
/**router.get('/:id',ensureToken,(req,res)=>
{
    jwt.verify(req.token,'my_secret_key',function(err,data){{
        if(err)
        {
           // res.sendStatus(403);
           res.status(403).send({ error: 'Access Denied!' })
        }else
        {
          var id = req.params.id;
          var sql = `SELECT * FROM orders WHERE Id=${id}`;
          db.query(sql, function(err, row, fields) {
         if(err) 
         {
           res.status(500).send({ error: 'Something failed!' })
         }
          res.json(row)
    })       
    }
    }})
});

*/
//  Delete a Specific Order
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
        }else
        {
          var id = req.params.id;
          var sql = `DELETE FROM orders WHERE Id=${id}`;
          db.query(sql, function(err, row, fields) {
            if(err) {
              res.status(500).send({ error: 'Something failed!' })
            }
            res.send({message:"Deleted"})
           // res.json(row[0])
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