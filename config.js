'use strict';

let host = 'http://47.89.52.24:9099';

if(process.env.NODE_ENV == 'dev'){
  host = 'http://47.89.42.150:9099';
}

let config = {
  db_host : 'rm-j6cv2s6eib935xu72o.mysql.rds.aliyuncs.com',
  db_username : 'snow',
  db_password : '1234qwer',

  exchange : 'chat',
  exopts : {durable : false},

  SENDMAIL : host + '/email/message',
  PUSHMESSAGE : host + '/push/message'
}

if(process.env.NODE_ENV == 'dev'){
  config.db_host = 'rm-j6c4m5p6xi1rliei2o.mysql.rds.aliyuncs.com';
  config.db_username = 'ifilmo_test';
  config.db_password = '1234Qwer!';
}

exports = module.exports = config;
