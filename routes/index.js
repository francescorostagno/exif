const express = require('express');
const router = express.Router();
const exif = require('exif-parser')
const multer = require('multer');

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
/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'CIAO'});
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


module.exports = router;
