
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
        if(data[0].username === req.body.username && data[0].password === req.body.password){
            obj.success = true;
            obj.message.username = data[0].username;
        }
        res.send(obj);
    });
};
