const express = require('express');
var router = express.Router();
var connection = require('../db');
var bodyParser = require('body-parser');
router.use(bodyParser.json());

//    App.js Route    /signup
router.post('/buyer',(req,res)=>
{
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

});




//   App.js  /signup
router.post('/seller',(req,res)=>
{
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

});



module.exports = router;