
!function ($) {
    $(function() {
        var Client = {
            
            isClicked: false,
            
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
            },
            
            bindEvent: function () {
                var me = this;
                //点击一键下拉中的选择按钮
                 $("#oneKeyBlock .dropdown-menu").on("click", "li", function(e) {
                     e.preventDefault();
                     //交换data-type值和文字
                     var nowKey = $("#oneKey"),
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
                         $("#payerBlock>span").html("付款人：");
                         $("#oneKeyBlock>span").html("付款总额(¥)：");
                     } else {
                         $("#payerBlock>span").html("充值人：");
                         $("#oneKeyBlock>span").html("充值额度(¥)：");
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
                        return;
                    }
                    if(!me.isRightValue()) {
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
                            $("#oneKey").next().removeClass("disabled");
                            $("#oneKey").html(oldText);
                        }
                    });
                });
            },
            
            isRightValue: function() {
                var val = $("#cash").val();
                if(/\D/.test(val)) {
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
            }
            
        };
        
        Client.init();
        Client.bindEvent();
    });
}(window.jQuery);
