const express = require('express');
const router = express.Router();
const exif = require('exif-parser')
const multer = require('multer');
const _ = require('lodash');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './public/images/');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
const upload = multer({ storage: storage })

const fs = require('fs')

const imageExt = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif'
]
/* GET home page. */
router.get('/', function(req, res, next) {
  let images = [];
  fs.readdir('./public/images/',function (err,files){
    if(err){
      console.log(err);
      res.render('index', { title: 'CIAO',images: images});
    }else{
      _.forEach(files,function(file){
        if( _.includes(imageExt,path.extname(file))){
          images.push(file);
        }
      })
      res.render('index', { title: 'EXIF APP',images: images});
    }
  });

});

router.post('/upload', upload.single('image'), async function (req, res) {

  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false
    });

  } else {

    const buffer = fs.readFileSync(req.file.path);
    const parser = exif.create(buffer);
    const result = parser.parse();
    const serverPath = req.file.path.split('/')[1] + '/' + req.file.path.split('/')[2]
    const absolutServerPath = req.file.path;
    delete result['startMarker']
    const orientationImage = result['tags']['Orientation'];
    return res.render('index', { imagePath: serverPath,absolutServerPath: absolutServerPath, exifData: result , orientationImage: orientationImage });
  }
});

router.post('/save', async function (req, res) {
  if (!req.body.newImage) {
    console.log("No file received");
    return res.send({
      success: false
    });

  } else {
    var base64Data = req.body.newImage.replace(/^data:image\/png;base64,/,"");
    fs.writeFile("./public/images/" + req.body.name + '.jpg', base64Data, 'base64', function(err) {
      if(!err){
        return res.render('index');
      }
    });
  }
})

router.post('/select',async function (req,res){
  if(!req.body.selectedImage){
    console.log("No file selected");
    return res.send({
      success: false
    });
  }else{
    const buffer = fs.readFileSync( './public/images/' + req.body.selectedImage);
    const parser = exif.create(buffer);
    const result = parser.parse();
    const serverPath = 'images/' + req.body.selectedImage;
    const absolutServerPath = 'public/images/'+ req.body.selectedImage
    delete result['startMarker'];
    const orientationImage = result['tags']['Orientation'];
    return res.render('index', { imagePath: serverPath,absolutServerPath: absolutServerPath, exifData: result , orientationImage: orientationImage});
  }
})


module.exports = router;
