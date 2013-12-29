
/*
 * GET home page.
 */
var Finnace = require("../models/finance");
var Single = require("../models/single");

//全局维护一个用户id和username的映射对象
var userMap = {};


//返回的数据格式
var obj = {
    success: true,
    message: {
        type: 1,
        payerId: null,
        username: null,
        error: ''
    },
    result: [],
    footResult: {
      // "name": "总额",
      // "consume": "-50",
      // "remain": 9253,
      // "time": "1369665569102"
    }
};


//为消费或充值的正数 添加加号
function getFormatResult(result) {
    var data = [];
    result.forEach(function(item, index) {
        if(item.consume > 0) {
            item.consume = "+" + item.consume;
        }
        data.push(item);
    });
    return data;
}

/*
 * 获取总额的值
 */
function getFootResult(result, idArr, payerId, type) {
    var foot = {
        name: "总额",
        consume: 0,
        remain: 0,
        time: new Date().getTime()
    };
    result.forEach(function(item, index) {
        var consume = parseFloat(item.consume),
            remain = parseFloat(item.remain);
            time = item.time;
        //如果不是全部人扣款的情况
        if (idArr) {
            idArr.forEach(function(m, i) {
                if(m == item.id) {
                    foot.consume += consume;
                }
            });
        } else {
            foot.consume += consume;
        }
        foot.remain += remain;
        foot.time = time;
    });
    //正数添加加号
    if(foot.consume > 0) {
        foot.consume = "+" + foot.consume;
    } 
    
    //如果是充值模式下 总额消费信息 、时间信息应该和充值的人保持一致
    if(payerId && type !== 1) {
        var index = getIndexFromListById(result, payerId);
        var consume = parseFloat(result[index].consume);
        foot.consume = (consume > 0) ? ('+' + consume) : consume;
        foot.time = result[index].time;
    }
    //保留一位小数
    if(/\./.test(foot.consume.toString())){
        foot.consume = parseFloat(foot.consume).toFixed(1);
    }
    if(/\./.test(foot.remain.toString())){
        foot.remain = foot.remain.toFixed(1);
    }
    return foot;
}

//根据对象ID从list数组中获取对象的序号
function getIndexFromListById(list, id) {
    var me = this,
        index = null;
   list.forEach(function(item, i){
        if(item.id === id) {
            index = i;
            return;
        }
    });
    return index;
}

//设置userMap
function setUserMap(data) {
    data.forEach(function(item, index) {
        userMap[item.id] = item.username;
    });
}

//保存历史记录
function saveHistory(username, options) {
    
    Single.insert(username, options, function(err) {
        if(err) {
            throw err;
        }
        console.log("保存" + username + "个人历史成功");
    });
}

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.get = function(req, res){
    var query = req.body.id ? ("id=" + req.body.id) : null;
    obj.message.username = req.session.username;
    Finnace.get(query, function(err, data) {
        obj.result = getFormatResult(data);
        obj.footResult = getFootResult(data);
        //更新全局用户id和username映射对象
        setUserMap(data);
        res.send(obj);
    })
};

exports.post = function(req, res){
    
    if(! req.session.username) {
        obj.success = false;
        obj.message.error = "请登录后操作！"
        res.send(obj);
    }
    
    var idArr = req.body.idArr,
        remainArr = req.body.remainArr,
        type =        parseInt(req.body.type),
        payerId =     parseInt(req.body.payerId),
        cash =        parseFloat(req.body.cash) || 0,
        payerRemain = parseFloat(req.body.payerRemain);
    idArr = idArr ? idArr.split(",") : [];
    remainArr = remainArr ? remainArr.split(",") : [];
    var len = idArr.length;
    //充值模式 & 单人消费模式
    
    //单人消费
    if (type === 3) {
        cash = -cash;
    }
    
    var options = {
        'id' : payerId,
        'consume': cash,
        'remain':  payerRemain + cash,
        'time': new Date().getTime()
    };
    Finnace.update(options, function(err) {
        if(err) {
        }
        
        //写入充值人的历史记录
        var addUsername = userMap[payerId];;
        var addOptions = {
            'consume': options.consume,
            'remain': options.remain,
            'time': new Date().getTime(),
            'remark': '充值'
        };
        if(type === 3) {
            addOptions.remark = "消费";
        }
        console.log(payerId + addOptions.remark + "成功");
        saveHistory (addUsername, addOptions);
        
        
        //消费模式
        if(type === 1) {
            remainArr[payerId - 1] = options.remain;
            idArr.forEach(function(id, index) {
                var id = parseInt(id);
                var remain = parseInt(remainArr[index]);
                
                var consume = parseFloat((cash/len).toFixed(1));
                var options = {
                    'id' : id,
                    'consume': -consume,
                    'remain':  remain-consume,
                    'time': new Date().getTime()
                };
                Finnace.update(options, function(err) {
                    if(err) {
                    }
                    console.log(id + "消费成功");

                    var minusUsername = userMap[id];
                    var minusOptions = {
                        'consume': options.consume,
                        'remain': options.remain,
                        'time': new Date().getTime(),
                        'remark': '消费'
                    };
                    
                    saveHistory (minusUsername, minusOptions);
                })
            });
        }
        
        //返回列表数据
        //FIXME 这里没有deferred，是sql按照顺序执行的缘故，然后保证了回调执行的顺序？
        Finnace.get(null, function(err, data) {
            console.log("数据返回成功");
            obj.result = getFormatResult(data);
            obj.footResult = getFootResult(data, idArr, payerId, type);
            obj.message.type = type;
            obj.message.payerId = payerId;
            obj.message.username = req.session.username;
            
            //当为付款模式时，对付款人和总额做双显示处理
            if(type === 1) {
                //充值人在返回数据中的顺序
                var payerIndex = getIndexFromListById(data, payerId);
                var payerConsume = data[payerIndex].consume;
                //对充值人的显示做双显示处理
                obj.result[payerIndex].consume = "+" + cash + "/" + payerConsume;
                //对总额做双显示处理
                obj.footResult.consume = "+" + cash + "/" + obj.footResult.consume;
            }
            res.send(obj);
        });
    })
};



