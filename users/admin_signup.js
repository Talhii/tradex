const express = require('express');
var router = express.Router();
var connection = require('../db');
var bodyParser = require('body-parser');
router.use(bodyParser.json());

//   app.js route   /adminsignup   
router.post('/',(req,res)=>
{
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