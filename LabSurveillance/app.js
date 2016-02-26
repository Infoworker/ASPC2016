

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');

var routes = require('./routes/index');
var users = require('./routes/user');

var spawn = require('child_process').spawn;

var app = express();
var expressWs = require('express-ws')(app);

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: ['views/partials/']
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
 
// array to hold the connections
var openChannels = [];
app.ws('/echo', function(ws, req) {
    // console.log("connected");  
  openChannels.push(ws);  
  ws.on("connection", function(cws) {
      console.log("connected");
  })
  ws.on('message', function(msg) {
        console.log("clients");
        console.log(ws);
        var child = spawn("powershell.exe",["C:\\git\\aspc2016\\labsurveillance\\screenshot.ps1"]);
        child.stdout.on("data",function(data){
            console.log("Powershell Data: " + data);
        });
        console.log("test");
        child.stderr.on("data",function(data){
            console.log("Powershell Errors: " + data);
        });
        child.on("exit",function(){
            //    openChannels.forEach(function(index, item) {
            //   if (item !== ws) { // make sure we're not sending to ourselves
                // console.log(openChannels.length);
                // if (item && item.send) {
                    // item.send("Picture updated ");
                // }
            //   }
            //    });
            // ws.send("Picture updated");
            aWss.clients.forEach(function (client) {
               client.send('hello');
            });
            console.log("Powershell Script finished");
        });
        child.stdin.end(); //end input

    console.log(msg);
  });
  console.log('socket', req.testing);
});
var aWss = expressWs.getWss('/echo');
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
