var express = require('express');
var http = require('http');
var request = require('request');
var router = express.Router();
var packer = require('zip-stream');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.post('/', function(req, res, next) {

	var url = req.body.link;
	var fileName = req.body.name;
	console.log(url);
	console.log(fileName);

	var archive = new packer();

	archive.on('error', function(err) {
	  throw err;
	});

	var file = request(url);
	res.setHeader('Content-disposition', 'attachment; filename='+fileName+'.zip');
	archive.pipe(res);

	// pipe archive where you want it (ie fs, http, etc)
	// listen to the destination's end, close, or finish event

	archive.entry(file, { name: fileName }, function(err, entry) {
	  if (err) throw err;
	   archive.finalize();
	});



	//res.setHeader("content-type", "application/octet-stream");
	
	
	//file.pipe(res);


	

});




module.exports = router;