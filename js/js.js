function WxChart(){
    var self = this;
    self.msg = [];
    self.opstName = '';
    self.selfTime = '13:14';
    self.bgimg = new Image();
    self.bgimg.src = './bgimg.png';
    self.inited = false;
    self.bgimg.onload = function(){
        self.inited=true;
        /*初始化*/
        self.cvs = document.createElement('canvas');
        self.cvs.height= self.bgimg.height;
        self.cvs.width = self.bgimg.width;
        self.ctx = self.cvs.getContext('2d');

    };
    self.bginputbox = new Image();
    self.bginputbox.src='./images/inputbox.png';

}

WxChart.prototype={
    init:function(){
        var self = this;

        setInterval(function(){
            if(self.inited){
                self.nowY=200;
                var ctx = self.ctx;
                var cvs = self.cvs;
                ctx.clearRect(0,0,cvs.width,cvs.height);
                /*绘制背景*/
                self.ctx.drawImage(self.bgimg,0,0,self.cvs.width,self.cvs.height);
                /*绘制姓名*/
                ctx.save();
                ctx.fillStyle='#fff';
                ctx.font='bold 2.5rem Arial';
                ctx.textAlign='center';
                ctx.fillText(self.opstName,cvs.width/2,100);
                ctx.restore();
                /*绘制时间*/
                ctx.save();
                ctx.fillStyle='#fff';
                ctx.font='bold 1.5rem Arial';
                ctx.textAlign='center';
                ctx.fillText(self.time,cvs.width/2,30);
                /*绘制聊天*/
                for(var i=0;i<self.msg.length;i++){
                    self.drawMsg(self.msg[i].role,self.msg[i].avt,self.msg[i].msg,self.nowY);
                }
                ctx.restore();
            }else{
                console.log('initing ... loading');
            }
        },100);
    },

    addMsg:function(msg){
        this.msg.push(msg);
    },
    clrMsg:function(){
        this.msg=[];
    },
    drawMsg:function(role,avt,msg,y){
        var self = this;
        var ctx = self.ctx;
        var cvs = self.cvs;
        var msgbord=[];
        if(!msg)msg='选择头像、谁发的、消息内容';
        if(!avt)avt=(function(src){var img=new Image();img.src=src;return img})('./xjp.jpg');
        if(!role)role='it';
        var x;
        if(role=='it'){
            /*绘制头像*/
            x=10;
            ctx.drawImage(avt,x,y,80,80);
            msgbord=[
                './images/w-l-t.png',
                './images/w-t.png',
                './images/w-r-t.png',
                './images/w-r.png',
                './images/w-r-b.png',
                './images/w-b.png',
                './images/w-l-b.png',
                './images/w-l.png',
                './images/w-vector.png'
            ];
        }else if(role=='me'){
            /*绘制头像*/
            x=self.cvs.width-95;
            ctx.drawImage(avt,x,y,80,80);
            msgbord=[
                './images/g-l-t.png',
                './images/g-t.png',
                './images/g-r-t.png',
                './images/g-r.png',
                './images/g-r-b.png',
                './images/g-b.png',
                './images/g-l-b.png',
                './images/g-l.png',
                './images/g-vector.png'
            ];
        }

        ctx.save();
        ctx.fillStyle = '#000';
        ctx.font = '3em Arial';
        ctx.textAlign='left';
        /*算行数*/
        var msgLen = self.ctx.measureText(msg).width;
        var widthLmit = 395;
        var linecount = Math.ceil(msgLen/widthLmit);
        msgLen = Math.min(msgLen,widthLmit);

        /*格式化成img*/
        for(var i=0;i<9;i++){
            msgbord[i]=(function(src){var img=new Image();img.src=src;return img})(msgbord[i])
        }

        /*重新计算聊天泡横坐标*/
        x=role=='it'?95:cvs.width-90-msgbord[0].width-msgbord[2].width-Math.min(msgLen,widthLmit);

        /*聊天泡文字修正值*/
        var adjustMe = -15;
        var adjustIt = 5;
        /*绘制盒子*/
        ctx.drawImage(msgbord[0],x+adjustIt,y);
        ctx.drawImage(msgbord[1],x+msgbord[0].width,y,msgLen+adjustMe,msgbord[0].height);
        ctx.drawImage(msgbord[2],x+msgLen+msgbord[0].width+adjustMe,y);
        ctx.drawImage(msgbord[3],x+msgLen+msgbord[0].width+adjustMe,y+msgbord[0].height,msgbord[2].width,linecount*36);
        ctx.drawImage(msgbord[4],x+msgLen+msgbord[0].width+adjustMe,y+msgbord[0].height+36*linecount);
        ctx.drawImage(msgbord[5],x+msgbord[0].width,y+msgbord[0].height+36*linecount,msgLen+adjustMe,msgbord[6].height);
        ctx.drawImage(msgbord[6],x+adjustIt,y+msgbord[0].height+36*linecount);
        ctx.drawImage(msgbord[7],x+adjustIt,y+msgbord[0].height,msgbord[0].width,linecount*36);
        /*绘制箭头*/
        if(role=='it'){
            ctx.drawImage(msgbord[8],x+adjustIt,y+msgbord[0].height)
        }else{
            ctx.drawImage(msgbord[8],x+msgLen+msgbord[0].width+adjustMe,y+msgbord[0].height)
        }
        /*加上填充*/
        ctx.save();
        ctx.fillStyle = role=='me'?'#a0e75a':'white';
        ctx.fillRect(x+msgbord[0].width,y+msgbord[0].height,msgLen,linecount*36);
        ctx.restore();
        /*填充文字*/
        var wordsList = msg.split('');
        var nowPos={x:x+msgbord[0].width,y:y+msgbord[0].height+28};
        for(i=0;i<wordsList.length;i++){
            if(nowPos.x+ctx.measureText(wordsList[i]).width>=x+widthLmit){
                /*x归零，y加1行，36px*/
                ctx.fillText(wordsList[i],nowPos.x+adjustIt,nowPos.y);
                nowPos.x=x+msgbord[0].width;
                nowPos.y+=36;
            }else{
                ctx.fillText(wordsList[i],nowPos.x+adjustIt,nowPos.y);
                /*x步进*/
                nowPos.x+=ctx.measureText(wordsList[i]).width;
            }
        }

        /*计算出最新的聊天位置*/
        self.nowY = y+msgbord[0].height+36*linecount+msgbord[5].height+40;
        /*最后盖上输入框盒子*/
        ctx.drawImage(self.bginputbox,0,cvs.height-self.bginputbox.height);
        ctx.restore();
    },
    setOpstName:function(name){
        this.opstName=name;
    },
    setSelfTime:function(time){
        this.time=time
    },
    addCanvasToImg:function(img){
        var self = this;
        var _timeid = setInterval(function(){
            if(self.inited){
                /*初始化成功*/
                img.src = self.cvs.toDataURL();
                clearInterval(_timeid);
            }else{
                console.log('addCanvasToImg ... loading');
            }
        },100);
    }
};


