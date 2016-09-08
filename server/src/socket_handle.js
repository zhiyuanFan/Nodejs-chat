'use strict';
let config = require('../../config');
let io = require('./socket_server');
let notice = require('./notice_handle');
let redisClient = require('../cache/client');


let exchange = config.exchange;

let online = {};
let temp = {};

/*
 * Initialize a new `SocketHandle`.
 * @public
 */
function SocketHandle(){
  if (!(this instanceof SocketHandle)){
    return new SocketHandle;
  }
  this.online = {};
  this.temp = {};
}

let Handle = SocketHandle.prototype;

/*
 * Handle
 * @Param {Object} Queue Channel
 */
Handle.handle = function(ch){
  let _ = this;

  io.on('connection',function(socket){

    //Upgrade socket id every connection
    socket.on('online',function(data){
      let identifier = data.uid;
      _.online[identifier] = socket.id;
      _.temp[socket.id] = identifier;
      io.sockets.emit('onlineList',_.online);
    });

    //获取未读信息
    socket.on('getUnread',function(data){
      redisClient.getByUidandOrder(data,function(err,result){
        if(err){
          console.error(err);
        }else{
          let uid = data.uid;
          if(_.online[uid]){
            io.to(_.online[uid]).emit('unread',result);
            redisClient.remove(data,function(err,result){
              if(err){
                console.error(err);
              }
            })
          }
        }
      })
    })

    //message handle
    socket.on('message',function(data){

      //信息主体
      let dataObj = {};
      dataObj.url = data.url;
      dataObj.platform = data.platform;
      dataObj.type = data.platform == 'pc'? '1':'2';
      dataObj.orderNo = data.orderNo;
      dataObj.sendUid = data.sendUid;
      dataObj.receiveUid = data.receiveUid;
      dataObj.timestamp = Date.now();
      dataObj.content = data.content;
      dataObj.contentType =  data.contentType || 'text';
      //传输主体
      let dataString = new Buffer(JSON.stringify(dataObj));
      //判断接收方是否在线
      if(_.online[data.receiveUid]){
        //即使发送信息
        io.to(_.online[data.receiveUid]).emit('message',data);
        //发布至存储队列
        ch.publish(exchange,'both',dataString);
      }else{
        //信息推送
        if(data.platform == 'pc'){
          // redisClient.getByUid(uid,function(err,result){
          //   if(err){
          //     data['badge'] = 0;
          //     notice.toUser(data);
          //   }else{
          //     try{
          //       let total = 0;
          //       for(let a in result){
          //         let temp = JSON.parse(result[a]);
          //         total += temp.length;
          //       } 
          //       data['badge'] = total;
          //       notice.toUser(data);
          //     }catch(err){
          //       data['badge'] = 0;
          //       notice.toUser(data);
          //     }
          //   }
          // });
          notice.toUser(data);
        }else if(data.platform == 'ios'){
          notice.toEditor(data);
        }
        io.to(_.online[data.sendUid]).emit('warn','该用户为离线状态');
        //发布至存储队列
        ch.publish(config.exchange,'single',dataString);
      }
    })

    //Disconnect
    socket.on('disconnect', function(){
      //清楚在线记录
      delete _.online[_.temp[socket.id]];
      delete _.temp[socket.id];
      //广播当前在线用户
      socket.broadcast.emit('onlineList',_.online);
    });

    //Socket Error Handle
    socket.on('error',err => {
      console.error(err);
    })

  })
}


module.exports = SocketHandle;
