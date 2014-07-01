var express = require('express');
var http = require('http');
var request = require('request');
var router = express.Router();
var packer = require('tar-stream');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.post('/', function(req, res, next) {

	var url = req.body.link;
	var fileName = req.body.name;
	console.log(url);
	console.log(fileName);

	var archive = packer.pack();

	var file = request(url);
	res.setHeader('Content-disposition', 'attachment; filename='+fileName+'.tar');
	

	var entry = archive.entry({ name: fileName }, function(err) {
		if (err)
			console.log(err);
	    archive.finalize();
	});

archive.pipe(res);
	file.pipe(entry);
	
});




module.exports = router;