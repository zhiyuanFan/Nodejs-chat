'use strict'

let amqp = require('amqplib/callback_api');
let util = require('../lib/util');
let config = require('../../config');


let exchange = config.exchange;
let exopts = config.exopts;

/*
 * amqp Handle
 * @Param {String} amqp host
 * @Param {Function} callback
 */
module.exports = (host,callback) => {
  amqp.connect(host,(err,conn)=>{
    if(err){
      callback(err,null);
      return bail(err);
    }
    conn.createChannel((err,ch)=>{
      if(err){
        callback(err,null);
        return bail(err,conn);
      }
      ch.assertExchange(exchange,'direct',exopts,(err,ok)=>{
        if(err){
          callback(err,null);
        }
        callback(null,ch,ok);
      })

    });
  })
}


/*
 * Error handle
 * @Param {Error} error
 * @Param {Object} connecttion
 */
function bail(err,conn){
  if (conn){
    conn.close(function(){
      process.exit(1);
    });
  }
}
