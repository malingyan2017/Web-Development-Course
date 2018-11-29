var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_maling',
  password        : '5670',
  database        : 'cs290_maling',
  dateStrings     : 'date'
});

module.exports.pool = pool;
