const express = require('express');
var app = express();


var http = require('http').Server(app);
var io = require('socket.io')(http);



var jwt = require('jsonwebtoken');
const db = require('./db');

const bodyparser = require('body-parser');
var productsRouter = require('./routes/products');
var buyerRouter = require('./routes/buyers');
var sellerRouter = require('./routes/seller');
var signUpRouter = require('./users/signUp');
const { json } = require('body-parser');
var signInRouter = require('./users/signIn');
var adminOrder = require('./routes/admin_order');
var adminProduct = require('./routes/admin_products');
var adminBuyer = require('./routes/admin_buyers');
var adminSeller = require('./routes/admin_sellers');
//var adminTransaction = require('./routes/admin_transactions');
var adminSignUp = require('./users/admin_signup'); 
//var image = require('./routes/upload_photo');
var bannerImage = require('./routes/banner1_image');
var headerImage = require('./routes/header_image');
var popularImage = require('./routes/popular_products_img');
var mpopularImage = require('./routes/most_popular_images');
var mostPopularProducts = require('./routes/most_popular_products');
var popularProducts = require('./routes/popular_products');
var productImages = require('./routes/product_images');
const { normalize } = require('path');


app.use('/productImages',productImages);
app.use('/popularProducts',popularProducts);
app.use('/mostPopularProducts',mostPopularProducts);
app.use('/mostPopularImages',mpopularImage);
app.use('/headerimage',headerImage);
app.use('/banner1image',bannerImage);
app.use('/popularimage',popularImage);
//app.use('/photo',image);
app.use('/adminsignup',adminSignUp);
//app.use('/admintransaction',adminTransaction);
app.use('/adminSeller',adminSeller);
app.use('/adminbuyer',adminBuyer);
app.use('/adminproduct',adminProduct);
app.use('/adminorder',adminOrder);
app.use('/signin',signInRouter);
app.use('/signup',signUpRouter);

app.use('/sellers',sellerRouter);
app.use('/buyers',buyerRouter);

app.use('/allProducts', productsRouter);
app.use(express.json());
app.use(bodyparser.json());


http.listen(process.env.PORT || 3000,()=>console.log("Express is runing at 3000"));

app.get('/new',(req,res)=>{

db.query("SELECT * FROM employee",function(err, result) {
    if(err) 
    {
      res.status(500).send({ err })
    }
    res.json({result})
});

});

/**

app.post('/signup',(req,res)=>
{
    var email = req.body.email;
    var psswrd = req.body.psswrd;
    var sql = `INSERT INTO buyers (Buyer_Id, Buyer_Name) VALUES ("${email}", "${psswrd}")`;
    connection.query(sql,function(err,result){
        if(err)
        {
            console.log(err);
            //res.status(500).send({error : "User Not Added "});
        }else
        {
            res.json({'status': 'success'});
        }
    })

});


app.post('/login',(req,res)=>
{
    var name = req.body.name;
   // const user = { id : 3 };
   var sql = `SELECT * FROM buyers WHERE Buyer_Name=?`;
   connection.query(sql,[name],function(err,result){
       if(err)
       {
           console.log(err);
          // res.status(500).send({error:"User Not Found"})
       }else
       {
       const token = jwt.sign({ name }, 'my_secret_key');
       res.json({
   
           token : token
       });
    }

   })
  

});

app.get('/protected',ensureToken,function(req,res){


    jwt.verify(req.token,'my_secret_key',function(err,data){{

        if(err)
        {
            sendStatus(403);
        }else{
            res.json({
                text : "This is protected",
                data :data
            });
        }
    }})
    
    
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
*/

var orders = []
var bids = []
var asks = []
var minimumask =[]
var maximumbid =[]

io.on('connection',socket=>{
    showorders()
    casks()
    cbids()
    
    socket.on('showorders',function(){
       showorders()
    })

    socket.on('getask',function(data){
        justshowasks(data.product)  
    })

    socket.on('getbid',function(data){
        justshowbids(data.product)  
    })

   

    function showorders(){
            orders = []
            db.query('SELECT * FROM orders')
            .on('result', function(data){
            orders.push(data)
            })
            .on('end', function(){
                socket.emit('initial orders', orders)
            })   
       }

       
   
        socket.on('new bid', function(data){
            db.query('INSERT INTO bids (User_Id,User_Name,Product_Id,Bid,Product_Name) VALUES (?,?,?,?,?)',[data.userids,data.usernames,data.productids,data.bid,data.productnames])
            cbids()   
         })

        socket.on('new ask', function(data){ 
            db.query('INSERT INTO asks (User_Id,User_Name,Product_Id,Ask,Product_Name) VALUES (?,?,?,?,?)', [data.userids,data.usernames,data.productids,data.ask,data.productnames])
            casks()
        })   

        socket.on('comparebestask',function(product){
             minimumask =[]

            db.query(`SELECT * FROM asks where ask=(SELECT MIN(ask) FROM asks where Product_Id="${product}")`)
            .on('result', function(data){
            minimumask.push(data)
            })
            .on('end', function(){
                socket.emit('comparebestask2', minimumask)  
            })    
        })

        socket.on('comparebestbid',function(product){
            maximumbid =[]
           db.query(`SELECT * FROM bids where bid=(SELECT MAX(bid) FROM bids where Product_Id="${product}")`)
           .on('result', function(data){
           maximumbid.push(data)
           })
           .on('end', function(){
               socket.emit('comparebestbid2', maximumbid)  
           })    
       })
        socket.on('updateorders',function(data){
            db.query('INSERT INTO orders (Buyer_Id,Buyer_Name,Seller_Id,Seller_Name,Price,Product_Id,Product_Name) VALUES (?,?,?,?,?,?,?)', [data.buyerid,data.buyername,data.sellerid,data.sellername,data.price,data.productid,data.productname])
            socket.broadcast.emit('update')
        })
        
        socket.on('delete',({deleteask, deletebid})=>{
            db.query('DELETE FROM asks where Id=?',deleteask)
            db.query('DELETE FROM bids where Id=?',deletebid)  
        })
         

      socket.on('deletebestask',function(data){
        db.query('DELETE FROM asks where Id=?',data)
      })

      socket.on('deletebestbid',function(data){
        db.query('DELETE FROM bids where Id=?',data)
      })

      socket.on('updateordersbestask',function(data){
        db.query('INSERT INTO orders (Buyer_Id,Buyer_Name,Seller_Id,Seller_Name,Price,Product_Id,Product_Name) VALUES (?,?,?,?,?,?,?)', [data.buyerid,data.buyername,data.sellerid,data.sellername,data.price,data.productid,data.productname])
        casks()
        socket.broadcast.emit('update')
    })
    socket.on('updateordersbestbid',function(data){
        db.query('INSERT INTO orders (Buyer_Id,Buyer_Name,Seller_Id,Seller_Name,Price,Product_Id,Product_Name) VALUES (?,?,?,?,?,?,?)', [data.buyerid,data.buyername,data.sellerid,data.sellername,data.price,data.productid,data.productname])
        cbids()
        socket.broadcast.emit('update')
    })
    
     function casks(){
        asks = []
        db.query('SELECT * FROM asks')
        .on('result', function(data){
           
        asks.push(data)
        })
        .on('end', function(){
            socket.emit('compare', {ask1:asks , bid1:bids})
        }) 
     }

     function cbids(){
        bids = []
    
        db.query('SELECT * FROM bids')
            .on('result', function(data){
              bids.push(data)
            })
            .on('end', function(){
              socket.emit('compare', {ask1:asks , bid1:bids})
         }) 
     }

     function justshowbids(product)
     {
        bids = []
    
        db.query('SELECT * FROM bids WHERE Product_Id=?',product)
            .on('result', function(data){
              bids.push(data)
            })
            .on('end', function(){
              socket.emit('initial bids', bids)
         }) 
     }

     function justshowasks(product)
     {
        asks = []
        db.query('SELECT * FROM asks WHERE Product_Id=?',product)
        .on('result', function(data){
           
        asks.push(data)
        })
        .on('end', function(){
            socket.emit('initial asks', asks)  
        })    
     }    
})



module.exports = app;