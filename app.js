var express = require('express');
var layouts = require('express-ejs-layouts');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth');
var compression = require('compression');
var logger = require('./log');
var geoloc = require('./ipgeo');
var swig = require('swig');
var version = require('./package.json').version;

var routes = require('./routes/index');

var version = require('./package.json').version;

var app = express();
var isDev = app.get('env') === 'development';
var cacheObject;
if (app.get('env') === 'development') {
    cacheObject = {};
} else {
    cacheObject = { maxAge: 31557600000 }; // One year
}

// view engine setup
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

swig.setDefaults({ cache: false });
swig.setFilter('version', function(input) {
    if (input === '@version') return version;
    if (isDev) return input.replace('@version', '' );
    return input.replace('@version', '.'+version+'.min' );
});


//app.use(favicon(__dirname + '/dist/img/favicon.ico'));
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

/* Static Routes */
app.use('/assets', express.static(path.join(__dirname, 'dist'), cacheObject));
app.use('/dl', express.static(path.join(__dirname, 'dl')));

/* Dynamic Routes */
app.use(layouts);
app.use('/', routes);

/* Logging */
app.use('/aj/logs', express.static(path.join(__dirname, 'logs')));

function auth(req, res, next){

    logger.info('Attempting to access Admin section');
    var user = basicAuth(req);

    if (user === undefined || user['name'] !== 'admin' || user['pass'] !== 'skippy') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="FTC"');
        res.end('Unauthorized');
    } else {
        next();
    }
}

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var ip = req.connection.remoteAddress;
    
    /*geoloc(ip, function(result){
        if (result && result.country)
            logger.info('404: ' + req.url + ' : ' + ip + ' (' + result.country + ', ' + result.city+', '+result.zip+')');
        else
            logger.info('404: ' + req.url+' : '+ip);
       
    });*/

    var err = new Error('Not Found');
    res.status(404);
    res.render('404');
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    console.info('I\'m in developement mode');
    app.use(function(err, req, res, next) {
        var status = err.status || 500;
        logger.error(status + ':' + req.url);
        res.status(status);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
else{
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        var status = err.status || 500;
        logger.error(status + ':' + req.url);
        res.status(status);
        res.render('error', {
            message: err.message,
            error: ''
        });
    });
}


module.exports = app;
