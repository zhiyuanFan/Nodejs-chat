'use strict';

let util = require('../lib/util');
let mysqlPool = require('../db/pool');
let redisClient = require('../cache/client');


module.exports = MsgHandle;


/*
 * Initialize a new `MsgHandle`.
 * @public
 */
function MsgHandle(){
  if (!(this instanceof MsgHandle)){
    return new MsgHandle;
  }
}


/*
 * Single online Message Handle
 * @Param {Object} Message Object
 */
MsgHandle.prototype.singleOnline = function(message){
  let _ = this;
  util.msg2Json(message,function(err,contentJSON){
    if(err){
      return console.log(err);
    }
    if(contentJSON.url || contentJSON.content){
      _.saveToDB(contentJSON,function(err,result){
        if(err){
          console.error(err);
        }else{
          console.log('ok :db');
        }
      });
      _.saveToCache(contentJSON,function(err,result){
        if(err){
          console.error(err.stack);
        }else{
          console.log('ok :cache');
        }
      });
    }
  })
}


/*
 * Both online Message Handle
 * @Param {Object} Message Object
 */
MsgHandle.prototype.bothOnline = function(message){
  let _ = this;
  util.msg2Json(message,function(err,contentJSON){
    if(err){
      return console.log(err);
    }
    if(contentJSON.url || contentJSON.content){
      _.saveToDB(contentJSON,function(err,result){
        if(err){
          console.error(err);
        }else{
          console.log('ok :db');
        }
      });
    }
  })
}


/*
 * Save unread message to Redis
 * @Param {Object} Message Data
 */
MsgHandle.prototype.saveToCache = function(jsonData,callback){
  redisClient.insert(jsonData,callback);
}


/*
 * Save data to mysql
 * @Param {Object} Message Data
 */
MsgHandle.prototype.saveToDB = function(jsonData,callback){
  mysqlPool.insert(jsonData,callback);
}
