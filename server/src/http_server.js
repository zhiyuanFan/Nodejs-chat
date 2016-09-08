'use strict';

const ejs = require('ejs');
const path = require('path');
const cors = require('cors');
const Server = require('express')();
const router = require('../api/router');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

Server.set('PORT',process.env.PORT || 8080);

Server.set('views', path.join(process.cwd(), 'sample'));
Server.set('view engine', 'ejs');

//允许跨域请求
Server.use(cors());
Server.use(cookieParser());
Server.use(bodyParser.json());
Server.use(bodyParser.urlencoded({
  extended: true
}));
Server.use(session({
    resave:false,
    saveUninitialized:true,
    secret: 'im',
    cookie:{
      maxAge: 60*60*2*1000
    }
}))
//api接口
Server.use(router);

//expose the Http Server
exports = module.exports = Server;
