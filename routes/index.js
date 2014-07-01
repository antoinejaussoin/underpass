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
	var fileName = req.body.name;
	console.log(url);
	console.log(fileName);

	//res.setHeader("content-type", "application/octet-stream");
	var file = request(url);
	res.setHeader('Content-disposition', 'attachment; filename='+fileName);
	file.pipe(res);


	

});




module.exports = router;