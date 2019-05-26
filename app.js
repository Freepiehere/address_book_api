var contacts = require('./routes/index');

const express = require('express');
const path = require('path');
const favicon = require('static-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`app listening to port ${PORT}`)
});
app.get("/", (req,res) => {
	console.log("Responding to root route")
	res.send("hello from root")
});

app.use("/",contacts);
/*app.get("/contact", (req,res) => {
	res.send("welcome to the address book.\nSuch Emtpy")
});
*/


