
var Single = require('../models/single');

var obj = {
    success: true,
    message: {
        username: ''
    },
    result: []
};


exports.get = function(req, res) {
    var username = req.body.username;
    Single.get(username, null, function(err, data) {
        obj.message.username = username;
        obj.result = data;
        res.send(obj);
    });
}; 
