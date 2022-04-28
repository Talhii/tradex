var express = require('express');
var router = express.Router();
var db = require('../db');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const Joi = require('joi');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({extended: false})); // for parsing application/x-www-form-urlencoded

// Seller Searching For His Ask By Id


//  App.js   /sellers

/*router.get('/viewAsk/:id',ensureToken,(req,res,next)=>
{
   jwt.verify(req.token,'my_secret_key',function(err,data){{
   if(err)
    {
        res.status(403).send({ error: 'Access Denied' })
    }
    else
    {
      var id = req.params.id;
      var sql = `SELECT * FROM asks WHERE Ask_Id=${id}`;
      db.query(sql, function(err, row, fields) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json(row[0])
    })
}
}})
});


/*get method for fetch single product*/
/**router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    var sql = `SELECT * FROM sellers WHERE Seller_Id=${id}`;
    db.query(sql, function(err, row, fields) {
      if(err) {
        res.status(500).send({ error: 'Something failed!' })
      }
      res.json(row[0])
    })
  });
  */

  /*Seller Putting An Ask*/
 
 // App.js   /sellers
/**  router.post('/createAsk', function(req, res, next) {
    
    var uid = req.body.uid;
    var uname = req.body.uname;
    var pid = req.body.pid;
    var ask = req.body.ask;
    var pname = req.body.pname;
    
  
    var sql = `INSERT INTO asks (User_Id, User_Name,Product_Id,Ask,Product_Name) VALUES ( ?,?,?,?,? )`;
    db.query(sql, [uid,uname,pid,ask,pname] ,function(err, result) {
      if(err) {
        res.status(500).send({ err })
      }
     res.json({'status': 'success'})
    })
  });
  
  /*Seller Updatig His Ask*/


//  App.js    /sellers
  router.put('/update/:id',ensureToken, function(req, res, next) {
   
    jwt.verify(req.token,'my_secret_key',function(err,data){{
      if(err)
          {
              res.status(403).send({ error: 'Access Denied' })
          }
   else
   {
     var aid = req.params.id;
    // console.log(aid);
    var ask = req.body.ask;
    // console.log("My requiirement is "+ req.body.ask);
    //var oid = req.params.id;
    //var pid = req.body.pid;
    //var uid = req.body.uid;
    //var order = req.body.order;
    //var sku = req.body.sku;
    //var price = req.body.price;
  
    var sql = `UPDATE asks SET Ask =? WHERE Id=${aid}`;
    db.query(sql,[ask] ,function(err, result) {
      if(err) {
        res.status(500).send({ err })
      }
        res.json({'status': 'success'})
    })
   }

    }});
  });
  
  /*Seller Delleting his Ask*/

  // App.js    /sellers
  router.delete('/delete/:id',ensureToken, function(req, res, next) 
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










    jwt.verify(req.token,'my_secret_key',function(err,data){{
      if(err)
          {
              res.status(403).send({ error: 'Access Denied' })
          }else
          {
            var id = req.params.id;
            var sql = `DELETE FROM asks WHERE Id=${id}`;
            db.query(sql, function(err, result) {
            if(err) 
            {
              res.status(500).send({ error: 'Something failed!' })
            }
              res.json({'status': 'success'})
    }
    )
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
  