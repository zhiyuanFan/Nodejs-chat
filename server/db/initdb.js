'use strict';

const sql = require('./sql');
const mysql = require('mysql');
const Promise = require('bluebird');
const config = require('../../config');

let db = mysql.createConnection({
  host : config.db_host,
  user : config.db_username,
  password : config.db_password,
  database : sql.DATABASE_NAME
})

/*
 * db init
 */
const INIT = () => {
  return new Promise((resolve,reject)=>{
    db.connect(function(err){
      if(err){
        reject(err);
      }
      db.query(sql.CREATE_IFILMO_CHAT_HISTORY,(err,result)=>{
        if(err){
          reject(err);
        }
        resolve(result);
        db.end();
      })
    });
  })
}

module.exports = INIT;
