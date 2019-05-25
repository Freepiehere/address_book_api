var express = require('express');
var router = express.Router();

var elastic = require('../elasticsearch');

/* GET contacts list */

/* GET contacts BY NAME */
router.get('/contact/:input', function (req,res,next)	{
	elastic.getSuggestions(req.params.input).then(function (result) {res.json(result)});
});

/* POST contact */
router.post('/contact', function (req,res,next)	{
	elastic.addDocumnet(req.body).then(function (result) { res.json(result) });
});
module.exports = router;

/* PUT contact BY NAME */

/* DELETE contact BY NAME */

