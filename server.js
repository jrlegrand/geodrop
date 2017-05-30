var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql'); 
var secrets = require('../geodrop-secrets'); 

var app = express();

app.use(bodyParser.json());

var connection = mysql.createConnection({
<<<<<<< HEAD
	host     : secrets.host(),
	user     : secrets.user(),
	password : secrets.password(),
	database : secrets.database()
=======
	host     : '',
	user     : '',
	password : '',
	database : ''
>>>>>>> f50e63fd64b3890ed11d9aadf9702c8ed7bc0e12
});

connection.connect();

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/add', (req, res) => {
	res.render('add');
});

app.get('/', (req, res) => {
	res.render('map');
});

// my latlng 36.1912198, -86.7296563
// http://localhost:3000/api/v1/geodrop/location/36.1912198,-86.7296563
app.get('/api/v1/geodrop/location/:lat,:lng', function(req, res){
	connection.query('SELECT *, ((ACOS(SIN(' + req.params.lat + ' * PI() / 180) * SIN(lat * PI() / 180) + COS(' + req.params.lat + ' * PI() / 180) * COS(lat * PI() / 180) * COS((' + req.params.lng + ' - lng) * PI() / 180)) * 180 / PI()) * 60 * 1.1515) AS distance FROM `geodrop` HAVING distance <= 10000 ORDER BY distance ASC', function(err, rows, fields){
		if (err) throw err;
		res.json(rows);
	});
});

// my latlng 36.1912198, -86.7296563
// ids 12 and 4 are nearby
// http://localhost:3000/api/v1/geodrop/location/36.1912198,-86.7296563/id/12
app.get('/api/v1/geodrop/location/:lat,:lng/id/:id/', function(req, res){
	connection.query('SELECT *, ((ACOS(SIN(' + req.params.lat + ' * PI() / 180) * SIN(lat * PI() / 180) + COS(' + req.params.lat + ' * PI() / 180) * COS(lat * PI() / 180) * COS((' + req.params.lng + ' - lng) * PI() / 180)) * 180 / PI()) * 60 * 1.1515) AS distance FROM `geodrop` WHERE id = ' + req.params.id + ' HAVING distance <= 0.030 ORDER BY distance ASC', function(err, rows, fields) {
		if (err) throw err;	
		res.json(rows);
	});
});

app.post('/api/v1/geodrop', function(req, res){
	connection.query("INSERT INTO geodrop (`id`, `lat`, `lng`, `text`, `timestamp`) VALUES (NULL, " + req.body.lat + ", " + req.body.lng + ", '" + req.body.text + "', CURRENT_TIMESTAMP)", function(err, rows, fields) {
		if (err) throw err;	
		res.json(rows);
	});
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
