'use strict';
let crypto = require('crypto');
let request = require('request');
let router = require('express').Router();
let Message = require('./controller/message');


//查询未读信息
router.get('/api/unread/:uid',Message.getUnRead);
//查询未读信息总数
router.get('/api/allunread/:uid',Message.getAllUnRead);
//通过Uid查询聊天记录
router.get('/api/history/byuid/:uid',Message.getByUid);
//通过order查询聊天记录
router.get('/api/history/byorderno/:uid',Message.getHistory);



/*test*/
router.get('/',(req,res,next)=>{
  if(!req.session.user){
    return res.redirect('/login');
  }
  let ip = req.ip;
  switch(ip){
    case '::1' : ip = '127.0.0.1';
      break;
    case '::ffff:127.0.0.1' : ip = '127.0.0.1';
      break;
    default : ip = '47.89.52.24';
  }
  res.render('chat',{ip : ip});
})

router.get('/login',(req,res,next)=>{
  if(!req.session.user){
    res.render('login',{})
  }else{
    res.redirect('/');
  }
})

router.post('/login',(req,res,next)=>{
  let b = req.body;
  if(!(b.email && b.password)){
    return res.status(400)
      .json({
        code : 0,
        message : 'params required',
        status : 'Bad Request'
      })
  }
  request.post({
    url : 'http://47.89.52.24:9099/editor/signin',
    body : {
      email : b.email,
      password : crypto.createHash('md5').update(b.password).digest('hex')
    },
    json : true
  },(err,response,body)=>{
    if(err){
      return res.status(500)
        .json({
          code : 0,
          message : err.message,
          status : 'Internal Server Error'
        })
    }
    if(response.statusCode == 200){
      req.session.user = body;
      res.cookie('uid',body.editorId);
      res.status(200)
        .json({
          code : 1,
          status : 'OK',
          result : body
        })
    }else if(response.statusCode == 400){
      res.status(400)
        .json({
          code : 0,
          message : body.msg,
          status : 'Bad Request'
        })
    }else{
      res.status(400)
        .json({
          code : 0,
          message : body,
          status : 'Internal Server Error'
        })
    }
  })
})



exports = module.exports = router;
