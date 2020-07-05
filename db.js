var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'project'
});

connection.connect(function(err){
    if(err) throw err;
    else
    console.log("Connected ! ");
    
});


module.exports=connection;