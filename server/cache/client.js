'use strict';

let redis = require('redis');

let redisConfig = {
  host : '127.0.0.1',
  port : '6379'
}

let client = redis.createClient(redisConfig);

client.on('error',function(err){
  console.error(err.message);
})


//Constructor
function RedisClient(client){
  this.client = client;
}

/*
 * 检查hash下某个key是否存在(Redis)
 * @Param {String} Hash Name
 * @Param {String} Key Name
 * @Param {Function} callback
 */
RedisClient.prototype.hexists = function(hash,key,callback){
  this.client.hmget(hash,key,(err,res)=>{
    if(err){
      callback && callback(err,null);
    }else{
      let exists = true;
      if(res[0] == null){
        exists = false;
      }
      callback && callback(null,exists);
    }
  })
}

/*
 * 插入数据到redis
 * @Param {Object} 数据
 * @Param {Function} callback
 */
RedisClient.prototype.insert = function(jsonData,callback){
  let _ = this;
  let orderNo = jsonData.orderNo,
      receiveUid = jsonData.receiveUid;
  _.hexists(receiveUid,orderNo,(err,res)=>{
    if(err){
      return callback && callback(err,null);
    }
    if(res){
      _.client.hmget(receiveUid,orderNo,function(err,res){
        if(err){
          return callback && callback(err,null);
        }else{
          try{
            let d = JSON.parse(res);
            d.push(jsonData);
            d = JSON.stringify(d);
            _.client.hmset(receiveUid,[orderNo,d],function(err,res){
              if(err){
                return callback && callback(err,null);
              }
              callback && callback(null,res);
            })
          }catch(err){
            return callback && callback(err,null);
          }
        }
      })
    }else{
      let strData;
      try{
        strData = JSON.stringify([jsonData])
      }catch(err){
        return callback && callback(err,null);
      }
      _.client.hmset(receiveUid,[orderNo,strData],(err,res)=>{
        if(err){
          return callback && callback(err,null);
        }
        callback && callback(null,res);
      })
    }
  })
}

/*
 * 通过uid删除未读聊天记录缓存
 * @Param {String} uid
 * @Param {Function} callback
 */
RedisClient.prototype.remove = function(data,callback){
  this.client.hdel(data.uid,data.orderNo,function(err,result){
    if(err){
      callback && callback(err,null);
    }else{
      callback && callback(null,result);
    }
  })
}

/*
 * 通过uid & orderNo 获取未读聊天记录缓存
 * @Param {String} uid
 * @Param {Function} callback
 */
RedisClient.prototype.getByUidandOrder = function(data,callback){
  this.client.hget(data.uid,data.orderNo,function(err,result){
    if(err){
      callback && callback(err,null);
    }else{
      try{
        result = JSON.parse(result);
        callback && callback(null,result);
      }catch(err){
        callback && callback(err,null);
      }
    }
  })
}

/*
 * 通过uid获取未读聊天记录缓存
 * @Param {String} uid
 * @Param {Function} callback
 */
RedisClient.prototype.getByUid = function(uid,callback){
  this.client.hgetall(uid,function(err,result){
    if(err){
      callback && callback(err,null);
    }else{
      callback && callback(null,result);
    }
  })
}


module.exports = new RedisClient(client);
