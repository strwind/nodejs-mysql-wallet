
var mysql = require('./db');

var single = {
    insert: function(tbname, options, callback) {
          var post = {
            consume: options.consume,
            remain:  options.remain,
            date:    options.date,
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

module.exports = single;
