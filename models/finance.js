var mysql = require('./db');

var Finance = {
    
    get: function(query, callback) {
        var sql = 'SELECT * FROM finance';
        if(query) {
            sql = 'SELECT * FROM finance WHERE ' + query;
        } 
        mysql.query(sql, function(err, rows, fields) {
             if (err) {
                 callback(err);
             }
             rows = rows || [];
             callback(null, rows);
        });
    },

    update: function(options, callback) {
        var sql = 'UPDATE finance SET consume = "'+ options.consume + '",' +
                  'remain = "' + options.remain + '",' +
                  'time = ' + options.time + ' ' +
                  'WHERE id = ' + options.id;
        mysql.query(sql, options, function(err, result) {
            if(err) {
                callback(err);
            }
            callback(err, result);
        })
    } 
};

module.exports = Finance;