const express = require('express');
const app = express();
const path = require("path");
const fs = require('fs')
// logger
const logger = require('morgan');
app.use(logger('dev'));

// body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(express.static('public'));
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/categories', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'categories.html'));
})

app.get('/subCategory', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', '/subCategory.html'));
})
app.get('/dental', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/dentalcare.html'));
})
app.get('/DentalCare', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/dentalcare.json'));
})

app.get('/subtype.html', function (req, res) {
  res.sendFile(path.join(__dirname + '/subtype.html'));
})

app.get('/event', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', '/event.html'))
});

app.get('/ChildCare', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'child-care-json.json'));
});

const userRoute = require('./routes/user');

app.use('/user', userRoute);


// if not req path match the above route
app.use((req, res, next) => {
  const error = new Error("No found");
  error.status = 404;
  next(error);  // forward the error obj to the next middlewares
});

// catch all types of error that could be from the above or throw by database or other applications
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: { message: error.message }
  });
});


module.exports = app;
