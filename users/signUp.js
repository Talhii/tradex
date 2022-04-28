const express = require('express');
var router = express.Router();
var connection = require('../db');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
const Joi = require('joi');

//    App.js Route    /signup
router.post('/buyer',(req,res)=>
{

        
  // fetch the request data
 const data = req.body;

 // define the validation schema
  const schema = Joi.object().keys({
 
 
      f_name: Joi.string().required(),
      l_name: Joi.string().required(),
      email: Joi.string().email({ minDomainAtoms: 2 }),
      psswrd: Joi.string().required(),
 
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










    var f_name = req.body.f_name;
    var l_name = req.body.l_name;
    var email = req.body.email;
    var psswrd = req.body.psswrd;
    var status="buyer";
    var sql = `INSERT INTO customers (First_Name,Last_Name,Email,User_Password,Status) VALUES (?,?,?,?,"${status}")`;
    connection.query(sql,[f_name,l_name,email,psswrd], function(err,result){
        if(err)
        {
            console.log(err);
            //res.status(500).send({error : "User Not Added "});
        }else
        {
            res.json({'status': 'New Buyer Created'});
        }
    })
      }
})
});




//   App.js  /signup
router.post('/seller',(req,res)=>
{


    
        
  // fetch the request data
 const data = req.body;

 // define the validation schema
  const schema = Joi.object().keys({
 
 
      f_name: Joi.string().required(),
      l_name: Joi.string().required(),
      email: Joi.string().email({ minDomainAtoms: 2 }),
      psswrd: Joi.string().required(),
 
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









   // var id = req.body.id;
    var f_name = req.body.f_name;
    var l_name = req.body.l_name;
    var email = req.body.email;
    var psswrd = req.body.psswrd;
    var status = "seller";
    var sql = `INSERT INTO customers (First_Name, Last_Name,Email,User_Password,status) VALUES (?,?,?,?,"${status}")`;
    connection.query(sql,[f_name,l_name,email,psswrd], function(err,result){
        if(err)
        {
            console.log(err);
            //res.status(500).send({error : "User Not Added "});
        }else
        {
            res.json({'status': 'A new Seller Created'});
        }
    })
      }
})
});



module.exports = router;