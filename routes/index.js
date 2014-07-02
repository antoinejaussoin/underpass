var express = require('express');
var request = require('request');
var router = express.Router();
var packer = require('zip-stream');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
	res.setHeader('Content-disposition', 'attachment; filename='+fileName+'.gzip');
	archive.pipe(res);

	archive.entry(file, { name: fileName }, function(err, entry) {
	  if (err) throw err;
	   archive.finalize();
	});	

	io.emit('file', {hello: 'world'});

});




module.exports = router;