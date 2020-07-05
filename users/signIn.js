const express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
var connection = require('../db');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var ro = require('../app');


// App.js   /signin
router.post('/seller',(req,res)=>
{
    var email = req.body.email;
    var sql = `SELECT * FROM customers WHERE Email=?`;
    connection.query(sql,[email],function(err,row){
      
        if(err)
        {
            console.log(err);
           res.status(500).send({err})
        }else if(!row.length)
        {
            console.log("Authentication Denied");
            res.send({"error":"Authentication Denied"})
            
     }else{
        if(email == row[0].Email)
     {     
        const token = jwt.sign({ email }, 'my_secret_key');
  
        res.json({

        token : token
        
    });
} }
 
    })
   
 

});


router.post('/buyer',(req,res)=>
{
    var email = req.body.email;
    var sql = `SELECT * FROM customers WHERE Email=?`;
    connection.query(sql,[email],function(err,row){
      
        if(err)
        {
            console.log(err);
           res.status(500).send({err})
        }else if(!row.length)
        {
            console.log("Authentication Denied");
            res.send({"error":"Authentication Denied"})
            
     }else{
        if(email == row[0].Email)
     {     
        const token = jwt.sign({ email }, 'my_secret_key');
  
        res.json({

        token : token
        
    });
} }
 
    })
   
 

});

//   Admin SignIn


//  App.js   /signin
router.post('/admin',(req,res)=>
{
    var email = req.body.email;
    var psswrd = req.body.psswrd;
    var sql = `SELECT * FROM admins WHERE Admin_Email=?`;
    connection.query(sql,[email],function(err,row){
      
        if(err)
        {
            console.log(err);
           res.status(500).send({err})
        }else if(!row.length)
        {
            console.log("Authentication Denied");
            res.send({"error":"Authentication Denied"})
            
     }else{
         console.log(psswrd);
         console.log(row[0].Admin_Password);
         console.log(row[0].Admin_Email);
         console.log(email);
        if(email == row[0].Admin_Email && psswrd == row[0].Admin_Password)
     {     
        const token = jwt.sign({ email }, 'my_secret_key');
  
        res.json({

        token : token
        
    });
}else{
    res.send({error:"Access Denied"})
} }
 
    })
   
 

});









/**

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



*/









module.exports = router;

