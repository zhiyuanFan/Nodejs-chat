'use strict';

let sql = require('./sql');
let mysql = require('mysql');
let R = require('ramda');
let config = require('../../config');

let mysqlConfig = {
  connectionLimit : 10,
  host : config.db_host,
  user : config.db_username,
  password : config.db_password,
  database : sql.DATABASE_NAME
}

let pool = mysql.createPool(mysqlConfig);


//Constructor
function MysqlPool(pool){
  this.pool = pool;
}

/*
 * 插入数据到db
 * @Param {Object} 数据
 * @Param {Function} callback
 */
MysqlPool.prototype.insert = function(data,callback){
  if(!data || R.isEmpty(data)){
    return callback(new Error('不能缺少data参数或者data不能为空'));
  }
  this.pool.getConnection(function(err,connection){
    connection.query(sql.INSERT_MESSAGE,data,function(err,result){
      if(err){
        callback && callback(err,null);
      }else{
        callback && callback(null,result);
      }
      connection.release();
    })
  })
}

/*
 * 通过订单号查询聊天记录
 * @Param {Object} uid/orderNo
 * @Param {Function} callback
 */
MysqlPool.prototype.findByOrderNo = function(data,callback){
  if(!data || R.isEmpty(data)){
    return callback(new Error('不能缺少data参数或者data不能为空'));
  }
  if(!data.uid){
    callback && callback(new Error('缺少uid'),null);
    return ;
  }
  if(!data.orderNo){
    callback && callback(new Error('缺少订单号'),null);
    return ;
  }
  this.pool.getConnection(function(err,connection){
    connection.query(sql.FIND_BY_ORDERNO,[data.uid, data.uid, data.orderNo],function(err,result){
      if(err){
        callback && callback(err,null);
      }else{
        callback && callback(null,result||[]);
      }
      connection.release();
    })
  })
}

/*
 * 通过uid查询聊天记录
 * @Param {String} uid
 * @Param {Function} callback
 */
MysqlPool.prototype.findByUid = function(uid,callback){
  if(!uid){
    return callback(new Error('uid不能为空'));
  }
  this.pool.getConnection(function(err,connection){
    connection.query(sql.FIND_BY_USERID,[uid,uid],function(err,result){
      if(err){
        callback && callback(err,null);
      }else{
        callback && callback(null,result);
      }
      connection.release();
    })
  })
}


module.exports = new MysqlPool(pool);
