$(function(){
	var canvas=$("#canvas").get(0);
	var ctx=canvas.getContext('2d');
	var sep=40;
	var sr=4;
	var R=20;
	var audio=$("#audio").get(0);
	var can_a=$("#can_a")[0];
	var can_b=$("#can_b")[0];
	var ctx1=can_a.getContext("2d");
	var ctx2=can_b.getContext("2d");
	var kongbai={};
	var AI=false;
	var gameState='pause';
	
	
	
	var kaishi=$(".kaishi");
	var end=$(".end");
	var bg=$("#bg");
	var begin=$("#begin");
	
	
	$(kaishi).on("click",function(){
		begin.css("display","none");
		bg.css("display","block")
	})
	$(end).on("click",function(){
		bg.css("display","none");
		begin.css("display","block")
	})
	
// 小圆	
	function cirle(x,y,r){
		ctx.save();
		ctx.beginPath();
		ctx.arc(lam(x),lam(y),r,0,Math.PI*2);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
	
	function lam(x){
		return (x+0.5)*sep+0.5;
	}
// 棋盘	
	function drawQipan(){
		ctx.save();
		ctx.beginPath();
		for(var i=0;i<15;i++){
			ctx.moveTo(20.5,20.5+i*sep);
			ctx.lineTo(580.5,20.5+i*sep);
			ctx.moveTo(20.5+i*sep,20.5);
			ctx.lineTo(20.5+i*sep,580.5);
		}
//		ctx.lineWidth="3";
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		
		cirle(3,3,sr);
		cirle(11,3,sr);
		cirle(7,7,sr);
		cirle(3,11,sr);
		cirle(11,11,sr);
	}
	for (var i = 0; i <15; i++) {
			for (var j = 0; j <15; j++) {
				kongbai[M(i,j)]=true;
			}
		}
	drawQipan();
	
	var qizi=[];
// 棋子
	// var qizi={};
	function drawzi(x,y,color){
		gameState='play';
		ctx.save();
		ctx.translate(lam(x),lam(y))
		ctx.beginPath();
		ctx.arc(0,0,R,0,Math.PI*2);
		
	var g=ctx.createRadialGradient(-10,-10,0,0,0,20);
		if(color==="black"){
//			ctx.globalAlpha="0.9";
		    g.addColorStop(0.1,"#ccc")
			g.addColorStop(0.5,"#000")
		    
		}else{
			g.addColorStop(0.1,"#fff")
	        g.addColorStop(0.5,"#eee")
			
		}
		ctx.fillStyle=g;
		ctx.fill();
		ctx.closePath();
		ctx.restore();
//		qizi.push({x:x,y:y,color:color});
		qizi[x +'_'+y]=color;
		delete kongbai[M(x,y)];
		gameState='play';
	}
	function has(x,y){
		var flags=false;
		$.each(qizi,function(i,v){
			if(v.x===x&&v.y===y){
				flags=true;
			}
		})
		return flags;
	}
	
// 棋谱
	function Qipu(){
		ctx.save();
		ctx.font='20px/1 微软雅黑';
		ctx.textBaseline='middle'
		ctx.textAlign='center';
		var index=1;
		for(var k in qizi){
			var arr=k.split('_');
			if(qizi[k]==="white"){
				ctx.fillStyle="black";
			}else{
				ctx.fillStyle="white";
			}
			ctx.fillText(index++,lam(parseInt(arr[0])),lam(parseInt(arr[1])));
		}
		ctx.restore();
		$('.box').addClass('active');
		if($('.box').find('img').length){
			$('.box').find('img').attr('src',canvas.toDataURL());
		}else{
			$('<img>').attr('src',canvas.toDataURL()).appendTo('.box');
		}
		
		$('<a>').attr('href',canvas.toDataURL()).attr('download','qipu.png').appendTo('.box');
	}
// 关闭
	$('.close').on('click',function(){
		$(this).parent().removeClass('active');
		drawQipan();
		for(var k in qizi){
			var x=parseInt(k.split('_')[0]);
			var y=parseInt(k.split('_')[1]);
			drawzi(x,y,qizi[k]);
			
		}
	})
// 查看棋谱
	$('.txt4').on('click',function(){
		Qipu();
	})
	
	//画指针
	var deg=0;
	function zhen1(){						
		can_a.width=200
		can_a.height=200
		ctx1.save()
		ctx1.beginPath()
		ctx1.arc(100,100,5,0,Math.PI*2)
		ctx1.closePath()
		ctx1.stroke();
		ctx1.restore()
		ctx1.save();	
		ctx1.translate(100,100)
		ctx1.rotate(Math.PI/180*6*deg)
		ctx1.beginPath()
		ctx1.moveTo(0,-5)
		ctx1.lineTo(0,-50)
		ctx1.moveTo(0,5)
		ctx1.lineTo(0,20)
		ctx1.closePath()
		ctx1.lineWidth="3";
		ctx1.strokeStyle="blue"
		ctx1.stroke();
		ctx1.restore();
		deg=deg+1;
		if(deg>=360){
			deg=0
		}
	}
	//指针
	var deg2=0;
	function zhen2(){						
		can_b.width=200
		can_b.height=200
		ctx2.save()
		ctx2.beginPath()
		ctx2.arc(100,100,5,0,Math.PI*2)
		ctx2.closePath()
		ctx2.stroke();
		ctx2.restore()
		ctx2.save();	
		ctx2.translate(100,100)
		ctx2.rotate(Math.PI/180*6*deg2)
		ctx2.beginPath()
		ctx2.moveTo(0,-5)
		ctx2.lineTo(0,-50)
		ctx2.moveTo(0,5)
		ctx2.lineTo(0,20)
		ctx2.closePath()
		ctx2.lineWidth="3";
		ctx2.strokeStyle="#E84803"
		ctx2.stroke();
		ctx2.restore();
		deg2=deg2+1;
		if(deg2>=360){
			deg2=0
		}
	}	
	zhen1()
	zhen2()
	var t2;
	var t1=setInterval(zhen1,1000)
	
	var flag=true;
// 点击事件
	function handleClick(){
			$("#canvas").on("click",function(e){
			var x=Math.floor(e.offsetX/sep);
			var y=Math.floor(e.offsetY/sep);
	//		if(has(x,y)){
	//			return;
	//		}
			 if(qizi[x+'_'+y]){
		         return;
		     }
            if (AI) {
            audio.play();
			drawzi(x,y,'black');
			if (panduan(x,y,"black")>=5) {
            	$("#canvas").off("click");
            	$('.info').find('#cont').html('黑棋赢').end().addClass('active1');
		     }
			var p=intel();
			drawzi(p.x,p.y,"white");
			if (panduan(p.x,p.y,"white")>=5) {
            	$("#canvas").off("click");
            	$('.info').find('#cont').html('白棋赢').end().addClass('active1');
		     };
			return false;
			
		}
            
			 
			 
			 
			 
			if(flag){
				drawzi(x,y,"black");
				if(panduan(x,y,"black")>=5){
					$("#canvas").off("click");
					$('.info').find('#cont').html('黑棋赢').end().addClass('active1');
					
				}
				deg2=0;
				deg=0;
				zhen1()
				clearInterval(t1)
				t2=setInterval(zhen2,1000)
				
				
				
			}else{
				
				drawzi(x,y,"white");
				if(panduan(x,y,"white")>=5){
					$("#canvas").off("click");
					$('.info').find('#cont').html('白棋赢').end().addClass('active1');
					
				}
				deg=0;
				deg2=0;
				zhen2()
				clearInterval(t2)
				t1=setInterval(zhen1,1000)
			}
			audio.play();
			flag=!flag;
//			return false;
		})
	}
	handleClick();
	
	
	function intel(){
		var max=-Infinity;
		var max2=-Infinity;
		var pos={};
		var pos2={}
		for (var k in kongbai) {
			var x=parseInt(k.split("_")[0]);
			var y=parseInt(k.split("_")[1]);
			var q=panduan(x,y,"black");
			if (q>max) {
				max=q;
				pos={x:x,y:y};
			}
			
		}
		for (var k in kongbai) {
			var x=parseInt(k.split("_")[0]);
			var y=parseInt(k.split("_")[1]);
			var q=panduan(x,y,"white");
			if (q>max2) {
				max2=q;
				pos2={x:x,y:y};
			}
			
		}
		if (max>max2) {
			return pos;
		}else{
			return pos2;
		}
		
	}
	
	
	
	function M(a,b){
		return a+"_"+b; 
	}
// 判断横、坚、左斜、右斜
	function panduan(x,y,color){
		var row=1,lie=1,xZ=1,xY=1;var i;
		i=1;while(qizi[M(x+i,y)]===color){
			row++;
			i++;
		}
		i=1;while(qizi[M(x-i,y)]===color){
			row++;
			i++;
		}
		i=1;while(qizi[M(x,y-i)]===color){
			lie++;
			i++;
		}
		i=1;while(qizi[M(x,y+i)]===color){
			lie++;
			i++;
		}
		i=1;while(qizi[M(x+i,y+i)]===color){
			xZ++;
			i++;
		}
		i=1;while(qizi[M(x-i,y-i)]===color){
			xZ++;
			i++;
		}
		i=1;while(qizi[M(x+i,y-i)]===color){
			xY++;
			i++;
		}
		i=1;while(qizi[M(x-i,y+i)]===color){
			xY++;
			i++;
		}
		
		
		return Math.max(row,lie,xZ,xY);
	}
	
	var txt3=$(".txt3");
// 重新开始

	txt3.on("click",function(){
		$('.info').removeClass('active1');
		canvas.width=600;
		canvas.height=600;
		drawQipan();
		handleClick();
		flags=true;
		qizi=[];
		gameState='pause';
	})
// 再来一局	
	$('.rest').on('click',function(){
		$('.info').removeClass('active1');
		canvas.width=600;
		canvas.height=600;
		drawQipan();
		handleClick();
		flags=true;
		qizi=[];
		gameState='pause';
		
		
	})
	$('.out').on('click',function(){
		location.reload();
	})
	
	
	
// 人人、人机换颜色
	
	$('#ai').on('click',function(){
		if(gameState==='play'){
			return;
		}
		$(this).addClass('red');
		$('#normal').removeClass('red');
		AI=true;
	});
	$('#normal').on('click',function(){
		if(gameState==='play'){
			return;
		}
		$('#ai').removeClass('red');
		$(this).addClass('red');
		AI=false;
	})
	
	
	
	
	
	
	
	
	





})
