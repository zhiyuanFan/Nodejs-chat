'use strict';

const path = require('path');
const spawn = require('child_process').spawn;
const amqpHandle = require('./server/src/amqp_handle');
const Socket = require('./server/src/socket_handle')();
const initDB = require('./server/db/initdb');

let QUEUE_PROCESS;

const QUEUE_PATH = './server/src/queue_process.js';

//QUEUE CONNECT
amqpHandle('amqp://localhost',(err,channel,result)=>{
  if(err){
    return console.error(err);
  }
  Socket.handle(channel);
})


initDB().then(tables=>{
  //开启队列监听
  QUEUE_PROCESS = spawn('node',[QUEUE_PATH]);

  QUEUE_PROCESS.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  QUEUE_PROCESS.stderr.on('data', (data) => {
    console.log(data.toString());
  });

}).catch(err=>{
  console.log(err);
});

//CaughtException
process.on('uncaughtException', function (err) {
  console.error(err.stack);
});

//eixt
process.on('exit',code => {
  QUEUE_PROCESS.kill('SIGHUP');
})
