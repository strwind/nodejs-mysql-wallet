
var mysql = require('./db');

var Single = {
    
    get: function(tbname, query, callback) {
        var sql = 'SELECT * FROM ' + tbname;
        mysql.query(sql, function(err, rows, fields){
            if(err) {
                callback(err);
            } 
            callback(null, rows);
        });
    },
    
    insert: function(tbname, options, callback) {
          var post = {
            consume: options.consume,
            remain:  options.remain,
            time:    options.time,
            remark:  options.remark
          };
          mysql.query('INSERT INTO ' + tbname +' SET ?', post, function(err, result) {
            if(err){
                callback(err);
            }
            callback(err, result);
         });
    }
};

module.exports = Single;
