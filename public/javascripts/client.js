
!function ($) {
    $(function() {
        var Client = {
            
            isClicked: false,
            
            isLogined: false,
            
            disabled: function(){return false;},
            
            init: function() {
                var me = this;
                $.ajax({
                    type:'POST',
                    url: '/get',
                    //data: query,
                    success: function(data) {
                        me.currentData = data;
                        me.rendTbody(data);
                        me.rendSelect(data);
                    }
                 });
                 me.beforeLogin();
            },
            
            bindEvent: function () {
                var me = this;
               
                //点击主页提示登录按钮
                 $("#tipBtn").click(function(e) {
                     e.preventDefault();
                     var val = $(this).find("span").html();
                     if(val === "登录") {
                         $("#loginBox").modal("show");
                         $("#username").focus();
                         me.beforeLogin();
                     } else {
                         $.ajax({
                            type:'POST',
                            url: '/logout',
                            success: function(data) {
                                if(data.success) {
                                     $("#tipBtn").find("span").html("登录");
                                     me.beforeLogin();
                                }
                            }
                         });
                     }
                 });
                 
                 //点击登录按钮登录
                 $("#login").click(function(e){
                    e.preventDefault();
                     //防止重复点击
                    if(me.isLogined){
                        return false;
                    }
                    if(!me.loginValidate()) {
                        $("#loginAlert").html("输入有误,只能输入字母和数字！");
                        $("#loginAlert").show();
                        return false;
                    };
                    
                    me.isLogined = true;
                    $(this).addClass("disabled");
                    $(this).html("loading...");
                    
                    var query = "username=" + $("#username").val()
                              + "&password=" + $("#password").val();
                    $.ajax({
                        type:'POST',
                        url: '/login',
                        data: query,
                        success: function(data) {
                            if(data.success) {
                                me.afterLogin(data.message.username);
                            } else {
                                $("#login").html("登录");
                                $("#login").removeClass("disabled");
                                $("#loginAlert").html("用户名或密码错误！");
                                $("#loginAlert").show();
                            }
                            me.isLogined = false;
                        }
                    });
                 });
                 
                //点击选择按钮
                $("#changeMode").click(function(e) { e.preventDefault(); });
                //点击一键下拉中的选择按钮
                 $("#payerBlock .dropdown-menu").on("click", "li", function(e) {
                     e.preventDefault();
                     //交换data-type值和文字
                     var nowKey = $("#changeMode"),
                         newKey = $(this).children(),
                         nowKeyText = nowKey.html(),
                         nowKeyType = nowKey.attr("data-type"),
                         newKeyText = newKey.html(),
                         newKeyType = newKey.attr("data-type");
                     nowKey.html(newKeyText);
                     nowKey.attr("data-type", newKeyType);
                     newKey.html(nowKeyText);
                     newKey.attr("data-type", nowKeyType);
                     //交换引起的联动
                     if(newKeyType == 1) {
                         $("#payerLabel").html("付款人：");
                         $("#cashLabel").html("付款总额(¥)：");
                         $("#oneKey").html("一键AA");
                         $("#oneKey").attr("data-type", "1");
                     } else {
                         $("#payerLabel").html("充值人：");
                         $("#cashLabel").html("充值额度(¥)：");
                         $("#oneKey").html("一键充值");
                         $("#oneKey").attr("data-type", "2")
                     }
                     
                     //清空输入框
                     $("#cash").val('');
                     //改变table的显示状态
                     me.changeTableType(newKeyType);
                 });
                //点击一键后的操作
                 $("#oneKey").click(function(e) {
                    e.preventDefault();
                    
                    //防止重复点击
                    if(me.isClicked){
                        return false;
                    }
                    if(!me.validate()) {
                        $("#inputAlert").removeClass("hidden");
                        $("#inputAlert").show();
                        return false;
                    };
                    $("#inputAlert").hide();
                    me.isClicked = true;
                    var oldText = $(this).html();
                    $(this).addClass("disabled");
                    $(this).next().addClass("disabled");
                    $(this).html("loading...");
                    //拼提交的参数
                    var type = $(this).attr("data-type"),
                        id = me.getCheckedValue(),
                        cash = $("#cash").val(),
                        remain = me.getCheckedRemain();
                        payerId = me.getParamByName("id", $("#payer").val());
                        payerRemain = me.getParamByName("remain", $("#payer").val());
                        query = "type=" + type +
                                "&idArr=" + id +
                                "&cash=" + cash +
                                "&remainArr=" + remain +
                                "&payerId=" + payerId + 
                                "&payerRemain=" + payerRemain;
                    console.log(query);
                    $.ajax({
                        type:'POST',
                        url: '/post',
                        data: query,
                        success: function(data) {
                            me.currentData = data;
                            me.rendTbody(data);
                            //释放按钮的状态
                            me.isClicked = false;
                            $("#oneKey").removeClass("disabled");
                            $("#oneKey").html(oldText);
                        }
                    });
                });
            },
            
            validate: function() {
                var val = $("#cash").val();
                if(!val || /\D/.test(val)) {
                    return false;
                }
                return true;
            },
            
            loginValidate: function() {
                var username = $("#username").val(),
                    password = $("#password").val();
                if(!username || /\W/.test(username) || !password || /\W/.test(password)) {
                    return false;
                }
                return true;
            },
            
            getCheckedValue: function() {
                var idArr = [];
                $.each($("#table :checked"), function(index, item) {
                    idArr.push($(item).val());
                });
                return idArr.join(",");
            },
            
            getCheckedRemain: function() {
                var me = this;
                var remainArr = [];
                $.each($("#table :checked"), function(index, item) {
                    $.each(me.currentData.result, function(i, m) {
                        if( $(item).val() == m.id ) {
                            remainArr.push(m.remain);
                            return;
                        }
                    })
                    
                });
                return remainArr.join(",");
            },
            
            getParamByName: function(key, name) {
                var me = this,
                    param = null;
                $.each(me.currentData.result, function(index, item){
                    if(item.name === name) {
                        param = item[key];
                        return;
                    }
                });
                return param;
            },
            
            changeTableType: function(type, payerId) {
                if(type == 1) {
                    this.setAllChecked(true);
                } else {
                    this.setAllChecked(false);
                }
                if(payerId) {
                    var index = parseInt(payerId) - 1;
                    $("#table tbody tr").eq(index).addClass("info");
                }
            },
            //表格中多选框全选或者全不选
            setAllChecked: function(status) {
                if(status) {
                      $.each($("#table :checkbox"), function(index,item) {
                          item.checked = true;
                      });
                 } else {
                      $("#table :checkbox").attr("checked", false);
                 }
            },
            
            rendSelect: function(data) {
               var options = '';
               $.each(data.result, function(index, item) {
                   options += '<option>' + item.name + '</option>';
               });
               $("#payer").html(options);
            },
            
            rendTbody: function(data) {
                var me = this,
                    itemArr = data.result,
                    tbody = '',
                    tfoot = '';
                $.each(itemArr, function(index, item) {
                    item.time = me.parseTimeStamp(item.time);
                    tbody += me.getRowHtml(item);
                });
                if (data.footResult) {
                    data.footResult.time = me.parseTimeStamp(data.footResult.time);
                }
                tfoot = me.getFootHtml(data.footResult);
                $("#table tbody").html(tbody);
                $("#table tfoot").html(tfoot);
                //改变table的显示状态
                me.changeTableType(data.message.type, data.message.payerId);
            },
            
            parseTimeStamp: function(timeStamp) {
                var time = new Date(parseInt(timeStamp));
                var year  = time.getFullYear(),
                    month = time.getMonth() + 1,
                    date  = time.getDate(),
                    hour  = time.getHours(),
                    min   = time.getMinutes(),
                    sec   = time.getSeconds();
                
                hour = hour < 10 ? '0' + hour : hour;
                min =  min  < 10 ? '0' + min  : min;
                sec =  sec  < 10 ? '0' + sec  : sec;
                time = year  + "-"  + 
                       month + "-"  +
                       date  + "  " +
                       hour  + ":"  +
                       min   + ":"  +
                       sec;
                return time;
            },
            
            getRowHtml: function(item) {
                if(!item) {return;}
                var row = 
                    '<tr>'+
                      '<td>'+
                          '<label class="checkbox">'+
                            '<input type="checkbox" checked value="' + item.id + '"/>'+
                             item.name  +
                          '</label>' +
                      '</td>' +
                      '<td>' + item.consume + '</td>' +
                      '<td>' + item.remain + '</td>' +
                      '<td>' + item.time + '</td>' +
                   '</tr>';
                return row;
            },
            
            getFootHtml: function(item) {
                if(!item) {return;}
                 var row = 
                    '<tr class="success">'+
                      '<td>' + item.name + '</td>' +
                      '<td>' + item.consume + '</td>' +
                      '<td>' + item.remain + '</td>' +
                      '<td>' + item.time + '</td>' +
                   '</tr>';
                return row;
            },
            
            beforeLogin: function() {
                var me = this;
                this.isClicked = true;
                $("#changeMode").addClass("disabled");
                $("#changeMode").next().addClass("disabled");
                $("#changeMode").next().on("click", me.disabled);
                $("#oneKey").addClass("disabled");
                $("#oneKey").html("请先登录");
                $("#welcome").html("你好，访客！");;
                $("#loginAlert").hide();
            },
            
            afterLogin: function(username) {
                var me = this;
                this.isClicked = false;
                $("#changeMode").removeClass("disabled");
                $("#changeMode").next().removeClass("disabled");
                $("#changeMode").next().off("click", me.disabled);
                $("#oneKey").removeClass("disabled");
                $("#oneKey").html("一键AA");
                $("#welcome").html("你好，" + username + "！");;
                $("#loginAlert").hide();

                $("#tipBtn span").html("登出");
                $("#login").html("登录");
                $("#login").removeClass("disabled");
                $("#loginBox").modal("hide");
            }
        };
        
        Client.init();
        Client.bindEvent();
    });
}(window.jQuery);
