$(function () {
    var doc=document;
    var canvas=doc.getElementById("canvas");
    var ctx=canvas.getContext("2d");//设置2维绘图环境
    var $gameBox=$("#gameBox");
    var $lis=$gameBox.find("li");//获取#gameBox下的li标签
    var image=new Image();//创建一个image对象
    var oriArr=[1,2,3,4,5,6,7,8,9];
    var imgArr=[1,2,3,4,5,6,7,8,9];
    var App={
        timeHandle:null,
        isComplete:false,
        level:0,
        //设置不同关卡的时间和图片
        levels:[
            {time:"60.00",image:"img/shulan.png"},
            {time:"40.00",image:"img/tuzi.png"},
            {time:"30.00",image:"img/together.png"},
            {time:"20.00",image:"img/shengdan.png"}
        ],
        //模块拖动的操作函数
        bind:function () {
            //阻止手机上浏览器的弹性下拉
            $("body").on("touchstart",function (e) {
               e.preventDefault();
            });
            //点击开始按钮(使用zepto框架的tap的点击事件，来规避click事件的延迟响应)
            $("#start").on("tap click",function () {
                $("#reset").prop("disabled",false);
                $("#layer").hide();//隐藏开始按钮
                App.resetData();//设置时间的初始状态
                App.countdown();//时间记数
                //再来一次时，顺序不变
                if ($(this).html!=="再来一次"){
                    App.randomImage(true);
                }else{
                    App.randomImage();
                }
            });
            //点击重新开始按钮
            $("#reset").on("tap click",function () {
                App.resetData();
                App.countdown();
                App.randomImage(true);
            });
            //开启拖动功能
            $lis.draggable="true";
            //获取拖动时的索引
            $lis.on("dragstart",function (e) {
                e.dataTransfer.setData("Index",$(this).index());//dataTransfer.setData() 方法设置被拖数据的数据类型和值
            });
            //设置允许放置
            $lis.on("dragover",function (e) {
                e.preventDefault();
            });
            $lis.on("drop",function (e) {
                e.preventDefault();
                var index=e.dataTransfer.getData("Index");//获取索引
                var prev=$lis.eq(index);//获取被拖模块的索引
                var html=$(this).html();//获取原本模块
                $(this).html(prev.html());//将原本的模块替换成被拖模块
                prev.html(html);//将被拖模块替换成原本的模块
                App.check();
            });

        },
        //设置界面的初始状态
        init:function () {
            $("#reset").prop('disabled',true);
            this.resetData();
            imgArr=[1,2,3,4,5,6,7,8,9];
            this.render();
        },
        //界面初始状态下的图片加载
        render:function () {
            image.onload=function () {
                App.randomImage();
            };
            image.src=this.levels[this.level].image;
        },
        //利用canvas对模块进行切割以及随机排序
        randomImage:function (flag) {
            flag=flag||false;
            //进行随机排列
            if (flag){
                imgArr.sort(function(a,b){
                   return Math.random()-Math.random();
                });
            }
            var index=1;
            for (var i=0;i<3;i++){
                for (var j=0;j<3;j++){
                    ctx.drawImage(image,300*j,300*i,300,300,0,0,300,300);//在画布上绘制模块
                    $lis.eq(imgArr[index-1]-1).find('img').data('seq',index).attr('src',canvas.toDataURL('image/jpeg'));// canvas.toDataURL('image/jpeg')意思为转换  Canvas 为 Image
                    index++;
                }
            }
        },
        //设置时间的初始状态
        resetData:function () {
            var time=this.levels[this.level].time;//获取当前关卡的时间
            $("#timing").text(time);
            $("#time").text(time);
            $("#level").text(this.level+1);
            $("#levels").text(this.levels.length);
        },
        //对时间进行记数字
        countdown:function () {
            clearInterval(this.timeHandle);//取消定时器
            this.timeHandle=setInterval(function () {
                var $time=$("#timing");
                var time=parseFloat($time.text());//获取当前关卡的总时间
                var currTime=(time-0.01).toFixed(2);//将数字精确到小数点后2位
                //若时间小于0
                if (currTime<0){
                    clearInterval(App.timeHandle);//取消定时器
                    $time.text(parseInt(currTime).toFixed(2));
                    App.update();
                }else{
                    $time.text(currTime);//否则时间继续减少
                }
            },10);
        },
        //设置时间到了后的状态
        update:function () {
          if (this.isComplete===false){
              alert("时间到,游戏结束");
              $("#layer").show();
              $("#start").html("再来一次");
              $("#reset").prop("disabled",true);
          }
        },
        check:function () {
            var resArr=[];
            $("#gameBox img").each(function (k,v) {
               resArr.push(v.getAttribute("data-seq"));
            });
            if (resArr.join("")===oriArr.join("")){
                setTimeout(function () {
                    window.clearInterval(App.timeHandle);
                    if (App.level>=App.levels.length-1){
                        alert("恭喜通关");
                        App.destory();
                    }else {
                        if (confirm("恭喜通关，是否继续挑战?")){
                            App.level++;
                            $("#layer").show();
                            App.init();
                        }
                    }
                },300);
            }
        },
        destory:function () {
          $("#reset").prop("disabled",true);
          $lis.css("border",0);
          $gameBox.css("border",0);
          $lis.off("drop");
        },
        //启动命令
        start:function () {
            this.init();
            this.render();
            this.bind();
        }
    };
    App.start();
});