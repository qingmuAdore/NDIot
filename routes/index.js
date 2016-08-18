var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'CMPP IOT Server' });
});



router.route('/info')
	.get(function (req, res, next) {
		res.send('info get');
	}).post(function (req, res, next) {
		res.send('info post');
	});

router.route('/config')
	.get(function (req, res, next) {
		res.send('config get');
	}).post(function (req, res, next) {
		res.send('config post');
	});

module.exports = router;
