var mysql = require("./db");

var user = {
    
    get: function(query, callback) {
        var sql = 'SELECT * FROM user WHERE ' + query;
        mysql.query(sql, function(err, rows, fields) {
            if(err) {
                callback(err);
            } else {
                callback(null, rows);
            }
        })
    }
    
};

module.exports = user;
