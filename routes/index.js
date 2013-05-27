
/*
 * GET home page.
 */
var Finnace = require("../models/finance");
var obj = {
    success: true,
    message: {
        type: 1,
        error: ''
    },
    result: []
};

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.get = function(req, res){
    var query = req.body.id ? ("id=" + req.body.id) : null;
    Finnace.get(query, function(err, data) {
        obj.result = data;
        res.send(obj);
    })
};

exports.post = function(req, res){
    var id = req.body.id,
        type = req.body.type,
        cash = req.body.cash || 0,
        remain = req.body.remain;
    var idArr = id ? id.split(",") : [],
        remainArr = remain ? remain.split(",") : [],
        len = idArr.length;
    idArr.forEach(function(id, index) {
        cash = parseInt(cash);
        id = parseInt(id);
        remain = parseInt(remainArr[index]);
        
        //消费模式
        var consume = parseFloat((cash/len).toFixed(1));
        var options = {
            'id' : id,
            'consume': "-" + consume,
            'remain':  remain-consume,
            'time': new Date().getTime()
        };
        //充值模式
        if (type == 2) {
            options.consume = "+" + cash;
            options.remain = remain + cash;
        }
        
        Finnace.update(options, function(err) {
            if(err) {
            }
            console.log(id + "更新成功");
        })
    });
    
    //FIXME 这里没有deferred，是sql按照顺序执行的缘故，然后保证了回调执行的顺序？
    Finnace.get(null, function(err, data) {
        console.log("数据返回成功");
        obj.result = data;
        obj.message.type = type;
        res.send(obj);
    })
    
};



