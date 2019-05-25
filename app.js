var contacts = require('./routes/contacts');
var express = require('express');
var app = express();
app.use('/contact', contacts);

const PORT = process.env.PORT || 9200;

app.get("/", (req,res) => {
	console.log("Responding to root route")
	res.send("hello from root")
});

app.get("/contact", (req,res) => {
	res.send("welcome to the address book.\nSuch Emtpy")
});
var elastic = require('./elasticsearch');
elastic.indexExists().then(function (exists) {
	if (exists) {
		return elastic.deleteIndex();
	}
}).then(function () {
	return elastic.initIndex().then(elastic.initMapping).then(function () {
		//add a few contacts for autocomplete
		var promises = [
			{'name':'James','work':'na','cell':'7038590021','email':'james.cameron96@gmail.com','birthday':'09/04/1996','address':'a','city':'c','state':'s'},
			{'name':'Melody','work':'na','cell':'na','email':'melody@eaiti.com','birthday':'na','address':'a1','city':'c1','state':'s1'}
		].map(function (contact) {
			return elastic.addContact({
				name:contact.name,
				work:contact.work,
				cell:contact.cell,
				email:contact.email,
				birthday:contact.birthday,
				address:contact.address,
				city:contact.city,
				state:contact.state,
				metadata: {
					nameLength: contact.name.length
				}
			});
		});
		return Promise.all(promises);
	});
});

app.listen(PORT, () => {
	console.log(`app listening to port ${PORT}`)
});
