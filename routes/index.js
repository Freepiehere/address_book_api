const config = require('../config/config.json');
const express = require('express');
const elasticsearch = require('elasticsearch');
const router = express.Router();

const client = new elasticsearch.Client({
	host: config.host,
});

const start = async (name) => {
	await client.ping({requestTimeout:30000});
	console.log('pinged server');

	let contact;
	return await client.search({
		index: 'contact',
		type: 'mytype',
		body: {
			query: {
				match: {
					name:name,
				},
			},
		},
	});
};


router.get('/contact/:name', function (req,res,next) {
	console.log("pinged AServer");
	start(req.params.name)
	.then(function(resp) {
		let name = req.params.name;
		if(!resp.hits.max_score){
			res.status(400).send({
				message:`NOT OKAY name ${name} not found`
			});
		}else{
			console.log(resp.hits.hits);
			contact = resp.hits.hits[0]._source;
			console.log("Hello");
			console.log(contact);
			res.status(200).send({
				message:`GET name ${name} okay`,
				contact: contact
			});
		}

	});
});

router.post('/contact', function(req,res,next) {
	start(req.body.name)
	.then(function(resp) {
		let name = req.body.name;
		console.log(resp);
		if (!resp.hits.max_score){
			client.index({
				index:'contact',
				type:'mytype',
				body: {
					"name":req.body.name,
					"work":req.body.work,
					"cell":req.body.cell,
					"email":req.body.email,
					"birthday":req.body.birthday,
					"address":req.body.address,
					"city":req.body.city,
					"state":req.body.state
				}
			}, function (err, resp, status)	{
				if(err){
					console.log(err);
				}else{
					return res.status(200).send({
						message:`POST call success`
					});
				}
			});
		}else{
			res.status(400).send({
				message:`NOT OKAY name ${name} taken`
			});
		}
	});
});

router.delete('/contact/:name', function(req,res,next) {
	start(req.params.name)
	.then(function(resp) {
		let name = req.params.name;
		if (!resp.hits.max_score) {
			return res.status(400).send({
				message: `NOT OKAY name ${name} not found`
			});
		}else{
			client.deleteByQuery({
				index:'contact',
				type:'mytype',
				body: {
					query: {
						match: { name:name}
					}
				}
			},function(error,response){
				console.log(response);
			});
			return res.status(200).send({
				message: `DELETE success ${name} removed`
			});
		}
	});
});

router.put('/contact/:name', function(req,res,next) {
	start(req.params.name)
	.then(function(resp) {
		let name = req.params.name;
		if(!resp.hits.max_score) {
			return res.status(400).send({
				message: `NOT OKAY name ${name} not found`
			});
		}else{
			client.deleteByQuery({
				index:'contact',
				type:'mytype',
				body: {
					query: {
						match: { name:name}
					}
				}
			});
			client.index({
				index:'contact',
				type:'mytype',
				body: {
					"name":req.body.name,
					"work":req.body.work,
					"cell":req.body.cell,
					"email":req.body.email,
					"birthday":req.body.birthday,
					"address":req.body.address,
					"city":req.body.city,
					"state":req.body.state
				}
			}, function (err, resp, status)	{
				if(err){
					console.log(err);
				}else{
					return res.status(200).send({
						message:`PUT call success`
					});
				}
			});
		}
	});
});
				
			
			





module.exports=router;
