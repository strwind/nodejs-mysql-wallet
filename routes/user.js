
/*
 * GET users listing.
 */
var user = require("../models/user");

var obj = {
    success: false,
    message: {
        'username': null
    }
};

exports.login = function(req, res) {
    var query = 'username="' + req.body.username + '"';
    user.get(query, function(err, data){
        if(err) {
            obj.success = false;
            res.send(obj);
            return;
        }
         
        if(data.length == 0) {
            obj.success = false;
            res.send(obj);
            return;
        }
        if(data[0].username === req.body.username && 
           data[0].password === req.body.password){
            obj.success = true;
            obj.message.username = data[0].username;
            req.session.username = data[0].username;
            res.send(obj);
            return;
        }
    });
};

exports.logout = function(req, res) {
    req.session.username = null;
    obj.message.username = null;
    obj.success = true;
    res.send(obj);
};




