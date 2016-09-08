'use strict';
let Promsie = require('bluebird');

/*
 * 获取数据类型
 * @Param {String|Number|Boolean|Object} data
 * @Return {String} type
 */
exports.type = d=>{
  switch(Object.prototype.toString.call(d)){
    case '[object Array]' : return 'array';
    case '[object Error]' : return 'error';
    case '[object String]' : return 'string';
    case '[object Object]' : return 'object';
    case '[object Function]' : return 'function';
  }
}

/*
 * 将信息主体转换为json格式
 * @Param {String} message
 * @Return {Promise}
 */
exports.msg2Json = (msg,callback) => {
  if(!callback) throw Error('need callback');
  let content = msg.content.toString(),
      contentJSON = {};
  try{
    let temp = JSON.parse(content);
    temp.type && (contentJSON.type = temp.type);
    temp.orderNo && (contentJSON.orderNo = temp.orderNo);
    temp.sendUid && (contentJSON.sendUid = temp.sendUid);
    temp.content && (contentJSON.content = temp.content);
    temp.url && (contentJSON.url = temp.url);
    temp.platform && (contentJSON.platform = temp.platform);
    temp.timestamp && (contentJSON.timestamp = temp.timestamp);
    temp.receiveUid && (contentJSON.receiveUid = temp.receiveUid);
    temp.contentType && (contentJSON.contentType = temp.contentType);
    callback && callback(null,contentJSON);
  }catch(e){
    callback(e,null);
  }
}
