/**
 *
 * Endpoints:
 * GET /contact?pageSize={}&page={}&query={}
 * - Provide a list of all contacts, allow for pageSize (#results allowed), offset by page#. query => *   queryStingQuery defined by elasticsearch
 * POST /contact
 * - Create a contact given UNIQUE name
 GET /contact/{name}
 * - Return the contact by a UNIQUE name. THis name should be specified by the person entering the data.
 * PUT /contact/{name}
 * - Update the contact by a UNIQUE name (err if not found)
 * DELETE /contact/{name}
 * - Delete the contact by a UNIQUE name (err if not found)
 *
 * 
 * TECHNICAL REQUIREMENTS:
 * Backend in Elasticsearch
 * Data model of a contact needs to be defined w/ reasonable assumptions
 * 	NAME WORK CELL HOME EMAIL BIRTHDAY ADDRESS CITY STATE
 * 	NAME: NO NUMBERS
 * 	WORK/CELL/HOME: 11 DIGITS MAX (15 NONSPACE CHARS MAX)
 * 	EMAIL: REQUIRE '@' AND '.???'
 * 	BIRTHDAY: 8 DIGITS, 10 CHARS, NO EXCEPTIONS
 * 	ADDRESS: WHATEVER
 * 	CITY: WHATEVER
 * 	STATE: WHATEVER
 * Bounds of input values must be defined (1000 digit phone number)
 * Host/port for eleasticsearch server should be configurable to allow an avaluator to run locally
 * Include automated unit tests to verify storage/retrieval (What is "Postman")
 * !!! Layer of separation between the REST handler and the actual logic
 */
var config = require("./config/config.json");
var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
	hosts:[ config.host ]
});
elasticClient.ping({
	requestTimeout: 30000,
}, function (error) {
	if(error) {
		console.error('Elasticsearch cluster is down!');
	}else{
		console.log('Everything is ok');
	}
});
var indexName = "contact";

function deleteIndex()	{
	return elasticClient.indices.delete({
		index: indexName
	});
}
exports.deleteIndex = deleteIndex;

function initIndex()	{
	return elasticClient.indices.create({
		index:indexName
	});
}
exports.initIndex = initIndex;

function indexExists()	{
	return elasticClient.indices.exists({
		index: indexName
	})
}
exports.indexExists = indexExists;

function initMapping()	{
	return elasticClient.indices.putMapping({
		index:indexNmae,
		type:"contact",
		body: {
			properties: {
				name: { type: "string" },
				work: { type: "string" },
				cell: { type: "string" },
				email: { type: "string" },
				birthday: { type: "string" },
				address: { type: "string" },
				city: { type: "string" },
				state: { type: "string" },
				suggest: {
					type: "completion",
					analyzer: "simple",
					search_analyzer: "simple",
					payloads: true
				}
			}
		}
	});
}
exports.initMapping = initMapping;

function addContact(contact)	{
	return elasticClient.index({
		index:indexName,
		type: "contact",
		body: {
			name: contact.name,
			work: contact.work,
			cell: contact.cell,
			email: contact.email,
			birthday: contact.bithday,
			address: contact.address,
			city: contact.city,
			state: contact.state,
			suggest: {
				input: contact.name.split(" "),
				output: contact.name,
				payload: contact.metadata || {}
			}
		}
	});
}
exports.addContact = addContact;

function getSuggestions(input)	{
	return elasticClient.suggest({
		index: indexName,
		type: "contact",
		body: {
			docsuggest: {
				text: input,
				completion: {
					field: "suggest",
					fuzzy: true
				}
			}
		}
	});
}
exports.getSuggestions = getSuggestions;

