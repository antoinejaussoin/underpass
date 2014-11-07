var express = require('express');
var http = require('http');
var request = require('request');
var router = express.Router();
var packer = require('zip-stream');
var logger = require('./../log');

/* GET home page. */
router.get('/', function (req, res) {
    logger.info('Website accessed from IP ' + req.connection.remoteAddress);
    res.render('index');
});

router.get('/error', function (req, res) {
    res.render('error');
});

router.post('/', function (req, res, next) {

    var url = req.body.link;
    var fileName = req.body.name;
    console.log(url);
    console.log(fileName);

    logger.info('Downloading ' + url + ', file: ' + fileName);

    try {
        var archive = new packer();

        archive.on('error', function (err) {
            throw err;
        });

        var file = request(url);
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName + '.gzip');
        archive.pipe(res);

        archive.entry(file, {
            name: fileName
        }, function (err, entry) {
            if (err) {
                logger.error('Error downloading ' + url + ', file: ' + fileName + ', error: ' + err);
                res.redirect('/error');
            } else {
                logger.info('Download success for ' + url + ', file: ' + fileName);
                archive.finalize();
            }
        });

    } catch (e) {
        res.redirect('/error');
    }

});




module.exports = router;