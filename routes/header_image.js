var express = require('express');
var router = express.Router();
var pool = require('../db')
var multer = require('multer')
var jwt = require('jsonwebtoken');
var fs = require('fs');
var sizeOf = require('image-size');
const resizeImg = require('resize-img');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Images/')
    },
    filename: function (req, file, cb) {
        var d = new Date();
        var time = d.getTime();
        cb(null, time + '_' + file.originalname)
    }
})

var upload = multer({
    storage: storage
});


// Upload a photo

// app.js   /headerimage

router.post('/',ensureToken  ,upload.single('image'), function (req, res, next) {

    // var image_name = req.body.image;
     
    var image_name = req.file.filename;
    console.log(image_name);
    console.log("image name in upload photo " + image_name);
    var id = 0;
    
    var dimensions = sizeOf('Images/'+image_name);
    
    console.log(dimensions.width, dimensions.height);
    var actual_width = dimensions.width;
    var actual_height =dimensions.height;
    var reduced_height,reduced_width;

    if(actual_height>actual_width)
    {
      console.log("height greater"); 
      reduced_width=180;
       var aspect_ratio =  actual_height / actual_width ;
       reduced_height = reduced_width * aspect_ratio
    }

	    else if(actual_height<actual_width)
    {
      console.log("width greater");

      reduced_height=180;
      var aspect_ratio =  actual_width / actual_height ;
      reduced_width = reduced_height * aspect_ratio
    }
    else if(actual_height==actual_width)
    {
      console.log("width and height is equal");
      reduced_height=180;
      reduced_width = 180;
    }
 
    (async () => {
      
      const image = await resizeImg(fs.readFileSync('Images/'+image_name), {
     
        
          width: reduced_width,
          height: reduced_height
      });
   console.log("photo="+image_name);
   
 
      fs.writeFileSync('Images/'+image_name, image);
       // delete file named 
//       fs.unlink('/Users/Ehtasham Abbas/Pictures/Saved Pictures/' + image_name, function (err) {
//        if (err) throw err;
        // if no error, file has been deleted successfully
//        console.log('File deleted!');
//    });
  })();

    var product_id = req.body.id;
    
    console.log("User_id in upload photo " + product_id);

    pool.query("INSERT INTO header_images value (?,?,?)", [id, image_name, product_id], function(err, row, fields) {
        if(err) {
          res.status(500).send(err)
        }
        res.json({status:"OK"})
      })
});


//  app.js   /headerimage


router.get('/getimage',ensureToken ,function(request, response) {
  pool.query("select * from header_images ", function(err, result) {
    //  response.writeHead(200, {
     //     'Content-Type': 'image/jpeg'
     // });
      //console.log("HELLO");
      response.send(result); // Send the image to the browser.
    //  response.json({status : "OK"})
    });
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

