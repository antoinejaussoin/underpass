var express = require('express');
var http = require('http');
var request = require('request');
var router = express.Router();
var packer = require('zip-stream');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});

router.get('/error', function(req, res) {
    res.render('error');
});


router.post('/', function(req, res, next) {

    var url = req.body.link;
    var fileName = req.body.name;
    console.log(url);
    console.log(fileName);

	try {
		  var archive = new packer();

	    archive.on('error', function(err) {
	        throw err;
	    });

	    var file = request(url);
	    res.setHeader('Content-disposition', 'attachment; filename=' + fileName + '.gzip');
	    archive.pipe(res);

	    archive.entry(file, {
	        name: fileName
	    }, function(err, entry) {
	        if (err) {
	        	res.redirect('/error');
	        } else {
	            archive.finalize();
	        }
	    });

	} catch(e) {
		res.redirect('/error');
	}
  
});




module.exports = router;
