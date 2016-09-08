'use strict';
const http = require('http');
const http_app = require('./http_server');
const http_server = http.Server(http_app);
const io = require('socket.io')(http_server);


http_server.listen(http_app.get('PORT'),()=>{
  console.log('HTTP & SOCKET Server listening on PORT ' + http_app.get('PORT'));
})


//expose the webSocket Server
exports = module.exports = io;
