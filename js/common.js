/**
 * 参数：
 *    {
 *      isBack:true,      //（可选）是否回顶部功能，默认为true
 *      goBack:false,     //（可选）是否返回上一页，默认为false。goback与isback同时为true时优先实现回顶部
 *      scrollTop:0,      //（可选）滚动条高度多少开始出现
 *      position:"auto",  //（可选）position为位置信息，内容的左边或者右边
 *      width:1000,       //（可选）距离网页内容模块的宽度
 *      offset:5,         //（可选）距离网页内容模块间距
 *      bottom:"auto"     //（可选）距离底部距离
 *    }
 */
(function($){$.fn.extend({"backBtn":function(options){
    var ops=$.extend({
        isBack:true,
        goBack:false,
        scrollTop:0,
        position:"auto",
        width:1000,
        offset:5,
        bottom:"auto",
        speed:100,
        ifshow:true
    }, options);
    var $dom=$(this),$doc=$(document),$win = $(window);
    if(!$dom.get(0)) return;
    var opr={
        getTop:function(){
            var t = $dom.offset().top;
            if(ops.bottom!="auto"){
                t = $win.height()-$dom.height()-ops.bottom;
            }
            return t;
        },
        getLeft:function(){
            var l = $dom.offset().left;
            var w = $dom.outerWidth();
            var ww = $win.width();
            var minw = ops.width+(ops.offset+w)*2;
            if(ops.position=="left"){
                if(ww>minw){
                    l = (ww-ops.width)/2-w-ops.offset;
                }else{
                    l=0;
                }
            }else if(ops.position=="right"){
                if(ww>minw){
                    l = (ww-ops.width)/2+ops.width+ops.offset;
                }else{
                    l=ww-w;
                }
            }
            return l;
        },
        ifShow:function(){
            if($win.scrollTop()>ops.scrollTop){
                $dom.show();
            }else{
                $dom.hide();
            }
        },
        setTop:function(){
            var t = this.getTop();
            var l = this.getLeft();
            if($.browser.msie&&$.browser.version==="6.0"){
                t = $doc.scrollTop()+t;
                if(t>$doc.height()){
                    t=$doc.height()-ops.bottom-$dom.outerWidth();
                }
                $dom.css({position:"absolute",top:t,left:l});
            }else{
                $dom.css("position","fixed");
                if($dom.css("left")!=l+"px"){
                    $dom.css("left",l);
                }
                if($dom.css("top")!=t+"px"){
                    $dom.css("top",t);
                }
            }
        },
        handler:function(){
            if(ops.isBack){
                $dom.live('click', function(){
                    $("body,html").animate({scrollTop:0},ops.speed);
                    if(ops.scrollTop>0){
                        $dom.hide();
                    }
                });
            }else if(ops.goBack){
                $dom.click(function(){
                    history.go(-1);
                });
            }
            var self = this;
            self.setTop();
            if(!ops.ifshow){
                self.ifShow();
            }
            $win.scroll(function(){
                if($.browser.msie&&$.browser.version==="6.0"){
                    self.setTop();
                }
                if(!ops.ifshow){
                    self.ifShow();
                }
            });
            $win.resize(function(){
                self.setTop();
                if(!ops.ifshow){
                    self.ifShow();
                }
            });
        }
    };
    opr.handler();
    return $dom;
}})})(jQuery);

/**热门试用 轮播js**/
var slide = {
	stop:true,
	index:0,
	len:null,
	animate:false,
	prevEvent:function(){
		var prev = $(".prev");
		prev.live("mouseover",function(){
			slide.stop = false;
		});
		prev.live("mouseout",function(){
			slide.stop = true;
		});
		var animate1 = false;
		prev.live("click",function(){
			if(animate1 || slide.animate) return;
			animate1 = true;
			slide.index--;
			if(slide.index<0) slide.index = slide.len-1;
			$(".slide-box").css("left","-1000px");
			$(".slide-box dl").css("left","1000px");
			$(".slide-box dl").eq(slide.index).css("left","0");
			$(".slide-box").animate({"left":"0"},800,function(){
				$(".slide-box dl").removeClass("on");
				$(".slide-box dl").eq(slide.index).addClass("on");
				animate1 = false;
			});
		});
	},
	nextEvent:function(){
		var next = $(".next");
		next.live("mouseover",function(){
			slide.stop = false;
		});
		next.live("mouseout",function(){
			slide.stop = true;
		});
		var animate1 = false;
		next.live("click",function(){
			if(animate1 || slide.animate) return;
			animate1 = true;
			slide.index++;
			if(slide.index>=slide.len) slide.index=0;
			$(".slide-box dl").css("left","0");
			$(".slide-box dl").eq(slide.index).css("left","1000px");
			$(".slide-box").animate({"left":"-1000px"},800,function(){
				$(".slide-box dl").eq(slide.index).css("left","0");
				$(".slide-box dl").removeClass("on");
				$(".slide-box dl").eq(slide.index).addClass("on");
				$(".slide-box").css("left","0");
				animate1 = false;
			});
		});
	},
	init:function(){
		slide.len = $(".slide-box dl").size();
		$('.slide-box').width(2000);
		/**自动 轮播**/
		setInterval(function(){
			if(!slide.stop) return;
			slide.animate = true;
			slide.index++;
			if(slide.index>=slide.len) slide.index=0;
			$(".slide-box dl").css("left","0");
			$(".slide-box dl").eq(slide.index).css("left","1000px");
			$(".slide-box").animate({"left":"-1000px"},800,function(){
				$(".slide-box").css("left","0");
				$(".slide-box dl").eq(slide.index).css("left","0");
				$(".slide-box dl").removeClass("on");
				$(".slide-box dl").eq(slide.index).addClass("on");
				slide.animate = false;
			});
		},3000);
		/**左右箭头点击**/
		this.prevEvent();
		this.nextEvent();
	}
}


$(function(){
	/**
	 * @首页热门试用
	 */
	slide.init();

	/**
	 * @导购清单json
	 */
	var indexNum = 0, allLen;//当前加载json页数，json长度
	$("#guid-btn").live("click",function(){
		var self = $(this);
		var param = '';//加载html变量
		self.addClass("loading").html("正在加载中");
		$.post("json/json.js",function(data){
			allLen = data.length;//获取json长度
			var data1 = data[indexNum];
			var dlen = data1.length;
			for(var j=0;j<dlen;j++){
				var thisd = data1[j];
				var img = thisd["img"];
				var text = thisd["text"];
				param+='<li><a href="detail.html"><img src="'+img+'" width="220" height="130"/><div class="info"><p class="name">'+text+'</p><div class="tip fix"><div class="right icon"><span class="xin">3</span><span class="look">3</span></div></div></div></a></li>';
			}
			self.parent().prev().append(param);
			indexNum++;
			if(indexNum>=allLen){
				self.parent().html('<span class="no-more">没有更多啦~</span>');
				indexNum = 0;
			}else{
				self.removeClass("loading").html("点击加载更多");
			}
		},"json");
	});
	/**
	 * @体验报告json
	 */
	$("#report-btn").live("click",function(){
		var self = $(this);
		var param = '';//加载html变量
		self.addClass("loading").html("正在加载中");
		$.post("json/json.js",function(data){
			allLen = data.length;//获取json长度
			var data1 = data[indexNum];
			var dlen = data1.length;
			for(var j=0;j<dlen;j++){
				var thisd = data1[j];
				var img = thisd["img"];
				var text = thisd["text"];
				var uName=thisd["uName"];
				var sTime=thisd["sTime"];
				param+='<li><a href="../guid/detail.html"><img src="'+img+'" width="700" height="412"/><div class="info"><p class="title">'+text+'</p><div class="btm fix"><div class="userInfo left"><span class="avt"></span><span class="name">'+uName+'</span><span class="time">'+sTime+'</span></div><div class="right icon"><span class="zan">3</span><span class="look">3</span></div></div></div></a></li>';
			}
			self.parent().prev().append(param);
			indexNum++;

			if(indexNum>=allLen){
				self.parent().html('<span class="no-more">没有更多啦~</span>');
				indexNum = 0
			}else{
				self.removeClass("loading").html("点击加载更多");
			}
		},"json");
	});

	/**
	 * @首页酷玩&&&酷玩页面json
	 */
	 var indexNum = 0, allLen;//
	$(".comMore").click(function(){
		
		var self = $(this);
		var param = '';//加载html变量
		self.addClass("loading").html("正在加载中");
		$.ajax({
			type:"post",
			url:"json/json.js",
			dataType:"json",
			success:function(data){
				console.log(data)
				allLen = data.length;//获取json长度
			var data1 = data[indexNum];
			var dlen = data1.length;
			for(var j=0;j<dlen;j++){
				var thisd = data1[j];
				var img = thisd["img"];
				var text = thisd["text"];
				var price=thisd["price"];
				param+='<li><a href="#"><img src="'+img+'" width="220" height="130"/><div class="info"><p class="name">'+text+'</span></p><div class="tip fix"><span class="price left">'+price+'</span><div class="right icon"><span class="xin">3</span><span class="look">3</span></div></div></div></a></li>';
			}
			self.parent().prev().append(param);
			indexNum++;
			if(indexNum>=allLen){
				self.parent().html('<span class="no-more">没有更多啦~</span>');
				indexNum = 0
			}else{
				self.removeClass("loading").html("点击加载更多");
			}
			}
		})
		// $.post("json/json.js",function(data){
		// 	allLen = data.length;//获取json长度
		// 	var data1 = data[indexNum];
		// 	var dlen = data1.length;
		// 	for(var j=0;j<dlen;j++){
		// 		var thisd = data1[j];
		// 		var img = thisd["img"];
		// 		var text = thisd["text"];
		// 		var price=thisd["price"];
		// 		param+='<li><a href="use/detail.html"><img src="'+img+'" width="220" height="130"/><div class="info"><p class="name">'+text+'</span></p><div class="tip fix"><span class="price left">'+price+'</span><div class="right icon"><span class="xin">3</span><span class="look">3</span></div></div></div></a></li>';
		// 	}
		// 	self.parent().prev().append(param);
		// 	indexNum++;
		// 	if(indexNum>=allLen){
		// 		self.parent().html('<span class="no-more">没有更多啦~</span>');
		// 		indexNum = 0
		// 	}else{
		// 		self.removeClass("loading").html("点击加载更多");
		// 	}
		// },"json");
	});

	//返回顶部
	$("#back").backBtn({
		isBack:true,
		goBack:false,
		scrollTop:0,
		position:"right",
		width:1000,
		offset:50,
		bottom:50,
		ifshow:false,
		speed:300
	});
});