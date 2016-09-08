'use strict';

module.exports = {
  DATABASE_NAME : "ifilmo_toc",
  IFILMO_CHAT_HISTORY : "IFILMO_CHAT_HISTORY",
  GET_TABLE_NAME : "SELECT TABLE_NAME "
      + " FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = SCHEMA()",
  CREATE_IFILMO_CHAT_HISTORY : "create table IF NOT EXISTS "
			+ " IFILMO_CHAT_HISTORY "
			+ " ( id INT(11) NOT NULL AUTO_INCREMENT,"
			+ " sendUid VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '发送者id',"
			+ " receiveUid VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '接收者id',"
			+ " url VARCHAR(300) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '内容地址',"
			+ " type VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '消息类型',"
			+ " orderNo VARCHAR(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '订单号',"
			+ " content VARCHAR(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '内容',"
			+ " contentType VARCHAR(12) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '内容格式',"
			+ " platform VARCHAR(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '发送平台',"
			+ " timestamp VARCHAR(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '发送时间',"
			+ " PRIMARY KEY (id)) ENGINE=InnoDB;",
  INSERT_MESSAGE : "INSERT INTO IFILMO_CHAT_HISTORY SET ?",
  FIND_BY_USERID : "SELECT * FROM IFILMO_CHAT_HISTORY where receiveUid = ? or sendUid = ?",
  FIND_BY_ORDERNO : "SELECT * FROM IFILMO_CHAT_HISTORY where (receiveUid = ? or sendUid = ?) and orderNo = ? order by timestamp ASC"
  // FIND_BY_ORDERNO : "SELECT * FROM IFILMO_CHAT_HISTORY where receiveUid = ? and orderNo = ?"
}
