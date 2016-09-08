'use strict';
let request = require('request');
let config = require('../../config');
let fs = require('fs');


exports.toUser = (content,callback) => {
  let body = {};
  body['sendId'] = Number(content.sendUid.replace('editor-',''));
  body['receiveId'] = Number(content.receiveUid.replace('user-',''));
  body['message'] = content.content;
  body['orderNo'] = content.orderNo;
  request.post({
    url : config.PUSHMESSAGE,
    body : body,
    json : true
  },(err,res,body)=>{
    if(err){
      callback && callback(err,null);
    }
    if(res.statusCode == 200){
      callback && callback(null,body);
    }else{
      callback && callback(new Error(body.msg || 'Internal Server Error'),null);
    }
  })
}


exports.toEditor = (content,callback) => {
  let body = {};
  body['sendId'] = Number(content.sendUid.replace('user-',''));
  body['receiveId'] = Number(content.receiveUid.replace('editor-',''));
  body['message'] = content.content;
  body['orderNo'] = content.orderNo;
  body['direction'] = 1;
  request.post({
    url : config.SENDMAIL,
    body : body,
    json : true
  },(err,res,body)=>{
    if(err){
      callback && callback(err,null);
    }
    if(res.statusCode == 200){
      callback && callback(null,body);
    }else{
      callback && callback(new Error(body.msg || 'Internal Server Error'),null);
    }
  })
}
