'use strict';

let util = require('../../lib/util');
let mysqlPool = require('../../db/pool');
let redisClient = require('../../cache/client');


/*
 * 查询未读信息
 * @Param {Object} request
 * @Param {Object} response
 * @Param {Function} next
 */
exports.getUnRead = (req,res,next) => {
  let content = {},
      uid = req.params.uid,
      orderNo = req.query.orderNo;
  if(uid == undefined){
    return res.status(400)
      .json({
        code : 0,
        status : 'Bad Request',
        message : '缺少uid参数'
      })
  }
  if(orderNo == undefined){
    return res.status(400)
      .json({
        code : 0,
        status : 'Bad Request',
        message : '缺少orderNo参数'
      })
  }
  content['uid'] = uid;
  content['orderNo'] = orderNo;
  redisClient.getByUidandOrder(content,function(err,result){
    if(err){
      ErrorResponse(res,err);
    }else{
      res.status(200)
        .json({
          code : 1,
          status : 'OK',
          data : result || [],
          total : result && Object.keys(result).length || 0
        });
      redisClient.remove(content,function(err,res){
        if(err){
          console.error(err);
        }
      })
    }
  });
}


/*
 * 查询聊天记录
 * @Param {Object} request
 * @Param {Object} response
 * @Param {Function} next
 */
exports.getHistory = (req,res,next) => {
  let content = {};
  if(req.params.uid == undefined){
    return res.status(400)
      .json({
        code : 0,
        status : 'Bad Request',
        message : '缺少uid参数'
      })
  }
  if(req.query.orderNo　== undefined){
    return res.status(400)
      .json({
        code : 0,
        status : 'Bad Request',
        message : '缺少orderNo参数'
      })
  }
  content['uid'] = req.params.uid;
  content['orderNo'] = req.query.orderNo;
  mysqlPool.findByOrderNo(content,(err,result)=>{
    if(err){
      ErrorResponse(res,err);
    }else{
      res.status(200)
        .json({
          code : 1,
          status : 'OK',
          data : result,
          total : result.length
        })
    }
  })
}


exports.getAllUnRead = (req,res,next) => {
  let uid = req.params.uid;
  if(uid == undefined){
    return res.status(400)
      .json({
        code : 0,
        status : 'Bad Request',
        message : '缺少uid参数'
      })
  }
  redisClient.getByUid(uid,function(err,result){
    if(err){
      ErrorResponse(res,err);
    }else{
      try{
        let total = 0,data = {};
        for(let a in result){
          let temp = JSON.parse(result[a]);
          total += temp.length;
          data[a] = temp.length || 0;
        } 
        res.status(200)
          .json({
            code : 1,
            status : 'OK',
            data : data || [],
            total : total
          });
      }catch(err){
        ErrorResponse(res,err);
      }
    }
  });
}



exports.getByUid = (req,res,next) => {
  let uid = req.params.uid;
  if(uid == undefined){
    return res.status(400)
      .json({
        code : 0,
        status : 'Bad Request',
        message : '缺少uid参数'
      })
  }
  mysqlPool.findByUid(uid,(err,result)=>{
    if(err){
      ErrorResponse(res,err);
    }else{
      res.status(200)
        .json({
          code : 1,
          status : 'OK',
          data : result,
          total : Object.keys(result).length
        })
    }
  })
}



/*
 * error response handle
 * @Param {Object} request
 * @Param {Object} response
 */
function ErrorResponse(res,err,m){
  if(!m){
    res.status(500)
      .json({
        code : 0,
        stack : err.stack,
        message : err.message,
        status : 'Internal Server Error'
      })
  }
}
