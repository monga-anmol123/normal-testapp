var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});




app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "EAAOqS1OJjdQBABjK3S9OJ40LOwInzkVHCXYjv2X6zAZCTNggTQ1JeXk4dsN6xqxQYgCgSIXwFXrFK5Ek5hAEmIWuH159CAyn7gb7YUzJN6NnHhCbCGriUuHs9jPK7ZBPZCkHWUsXI17nocG8IrV2uNfuyTL6R0672DMzto5nfEcUGGZAZAZCeC"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
  // let VERIFY_TOKEN = "EAAOqS1OJjdQBABjK3S9OJ40LOwInzkVHCXYjv2X6zAZCTNggTQ1JeXk4dsN6xqxQYgCgSIXwFXrFK5Ek5hAEmIWuH159CAyn7gb7YUzJN6NnHhCbCGriUuHs9jPK7ZBPZCkHWUsXI17nocG8IrV2uNfuyTL6R0672DMzto5nfEcUGGZAZAZCeC"
  // curl -X GET "localhost:33333/webhook?hub.verify_token=EAAOqS1OJjdQBABjK3S9OJ40LOwInzkVHCXYjv2X6zAZCTNggTQ1JeXk4dsN6xqxQYgCgSIXwFXrFK5Ek5hAEmIWuH159CAyn7gb7YUzJN6NnHhCbCGriUuHs9jPK7ZBPZCkHWUsXI17nocG8IrV2uNfuyTL6R0672DMzto5nfEcUGGZAZAZCeC&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"