'use strict';

let config = require('../../config');
let amqp = require('amqplib/callback_api');
let msg_handle = require('./msg_handle')();

let exopts = config.exopts;
let exchange = config.exchange;

//caughtException
process.on('uncaughtException', function (err) {
  console.error(err.stack);
});


//connect
amqp.connect(on_connect);

/*
 * Connect Handle
 * @Param {Error} error
 * @Param {Object} connecttion
 */
function on_connect(err, conn) {
  if (err !== null){
    return bail(err);
  }
  process.once('SIGINT', function() {
    conn.close();
  });

  conn.createChannel(function(err, ch) {
    if (err !== null){
      return bail(err, conn);
    }

    //声明Exchange
    ch.assertExchange(exchange, 'direct', exopts);

    //声明队列Single
    ch.assertQueue('single', {exclusive: true}, function(err, ok) {
      if (err !== null){
        return bail(err, conn);
      }
      let queue = ok.queue;

      function sub(err) {
        if (err !== null){
          return bail(err, conn);
        }
        ch.bindQueue(queue, exchange, 'single', {}, sub);
      }

      ch.consume(queue,function(msg){
        msg_handle.singleOnline(msg);
        
      }, {noAck: true},function(err) {
        if (err !== null){
          return bail(err, conn);
        }
        sub(null);
      });
      console.log('创建队列Single成功～');
    });


    //声明队列Both
    ch.assertQueue('both', {exclusive: true}, function(err, ok) {
      if (err !== null){
        return bail(err, conn);
      }
      let queue = ok.queue;

      function sub(err) {
        if (err !== null){
          return bail(err, conn);
        }
        ch.bindQueue(queue, exchange, 'both', {}, sub);
      }

      ch.consume(queue,function(msg){
        msg_handle.bothOnline(msg);
      }, {noAck: true},function(err) {
        if (err !== null){
          return bail(err, conn);
        }
        sub(null);
      });
      console.log('创建队列Both成功～');
    });
  });
}


/*
 * Error Handle
 * @Param {Error} error
 * @Param {Object} connecttion
 */
function bail(err, conn) {
  if (conn) conn.close(function() {
    process.exit(1);
  });
}