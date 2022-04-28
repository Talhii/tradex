const express = require('express');
var router = express.Router();
var connection = require('../db');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
const Joi = require('joi');

//   app.js route   /adminsignup   
router.post('/',(req,res)=>
{

     
  // fetch the request data
 const data = req.body;

 // define the validation schema
  const schema = Joi.object().keys({
 
 
      name: Joi.string().required(),
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


    var name = req.body.name;
    var email = req.body.email;
    var psswrd = req.body.psswrd;
    var sql = `INSERT INTO admins (Admin_Name,Admin_Email,Admin_Password) VALUES (?,?,?)`;
    connection.query(sql,[name,email,psswrd], function(err,result){
        if(err)
        {
            console.log(err);
            //res.status(500).send({error : "User Not Added "});
        }else
        {
            res.json({'status': 'New Admin Created'});
        }
    })

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