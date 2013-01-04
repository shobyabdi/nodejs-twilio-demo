var express = require('express');
var app     = module.exports = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
var port    = process.env.PORT || 5000;

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.engine('html', require('ejs').renderFile);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

io.configure(function () { 
  io.set('transports', ['xhr-polling']); 
  io.set('polling duration', 10); 
  io.set('log level', 1);
});

io.sockets.on('connection', function (socket) {
  console.log('client connected to socket.io');
});

app.get('/', function(req, res) {
    res.render("realtime.html");
});

app.post('/recsms', function(req, res) {
  io.sockets.emit('twilio', JSON.stringify(req.body));
  res.end();
});

server.listen(port);
console.log('Realtime app running on port ' + port);