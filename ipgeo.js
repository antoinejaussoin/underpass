var http = require('http');

function loc(ip, cb){
	

	var options = {
	  host: 'freegeoip.net',
	  port: 80,
	  path: '/json/'+ip,
	  method: 'GET'
	};

	http.request(options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	  	var data = JSON.parse(chunk);
	    cb({
	    	country: data.country_name,
	    	city: data.city,
	    	zip: data.zipcode
	    });
	  });
	}).end();

}



module.exports = loc;