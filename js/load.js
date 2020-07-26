/**
 * Created by zongjuan.wang on 2016/2/24.
 */
/**
 * @试用报告json
 */
 console.log(1)
 // 如果是滑到footer处  
 // 总高度=footer的高度加上 +滚动条的高度+加上当前页面的高度
 
var load = false;//判断是否加载成功
var indexNum = 0, allLen;//当前加载json页数，json长度
//[{},{},{},{}]
$(window).scroll(function(){
    if(load) return;
    var self = $("#use-btn");
    var dh = $("body").height();
    var wh = $(this).height();
    var foot=$(".foot").height();
    //alert(wh)
    
    if( $(this).scrollTop() >= dh-wh-foot ){
        load = true;
        var param = '';//加载html变量
        //根据当前选项卡所选择的内容，请求不同的数据
        //通过switch来判断 变化路径
        //ajax请求 和之前就是一样的
        $.post("json/json.js",function(data){
            allLen = data.length;//获取json长度
            var data1 = data[indexNum];
            var dlen = data1.length;
            for(var j=0;j<dlen;j++){
                var thisd = data1[j];
                var img = thisd["img"];
                var text = thisd["text"];
                param+='<dt><a href=""><span class="top-tip shoufa">首发</span><img src="'+img+'" width="220" height="130"/><div class="hot-con"><h2 class="name">'+text+'</h2><p class="tabs red"><span>2032</span><span>20台</span></p><p class="sq"><span>1392</span>申请</p><p class="current red">剩余时间2天</p></div></a></dt>';
            }
            self.parent().prev().append(param);
            indexNum++;
            load = false;
            if(indexNum>=allLen){
                self.parent().html('<span class="no-more">没有更多啦~</span>');
                load = true;
            }else{
                self.removeClass("loading").html("向下拉加载更多");
            }
        },"json");
    }
});