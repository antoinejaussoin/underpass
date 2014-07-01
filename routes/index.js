var express = require('express');
var http = require('http');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.post('/', function(req, res, next) {

	var url = req.body.link;
	console.log(url);

	//res.setHeader("content-type", "application/octet-stream");
	var file = request(url);
	file.pipe(res);


	
	//res.redirect('/');

});




module.exports = router;