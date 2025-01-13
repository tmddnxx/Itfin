class EXTriangle extends AComponent{constructor(){super(),this.frwName="stock",this.arrowEl=null,this.arrowH=0,this.headH=0,this.bodyH=0}}EXTriangle.CONTEXT={tag:'<div data-base="EXTriangle" data-class="EXTriangle" class="EXTriangle-Style" data-use-stockcolor="true" data-color-up="'+StockColor.UP_COLOR+'" data-color-down="'+StockColor.DOWN_COLOR+'">\t\t\t<div></div><div></div></div>',defStyle:{width:"20px",height:"20px"},events:[]},EXTriangle.prototype.init=function(t,r){AComponent.prototype.init.call(this,t,r),this.$ele.css("overflow","visible"),this.arrowEl=this.element.children[0],this.arrowBodyEl=this.element.children[1],null==this.arrowBodyEl&&(this.arrowBodyEl=$("<div></div>")[0],$(this.element).append(this.arrowBodyEl)),$(this.arrowBodyEl).css("margin","0 auto"),this.arrowEl.style.borderStyle="solid",this.arrowEl.style.width="0px",this.arrowEl.style.height="0px",this.getAttr("data-use-stockcolor")?this.setUpDownColor(StockColor.UP_COLOR,StockColor.DOWN_COLOR):this.setUpDownColor(),this.initPos(),this.setDirection(this.getAttr("data-direction"))},EXTriangle.prototype.initPos=function(){this.arrowW=parseInt(this.getWidth(),10)/2,this.arrowH=parseInt(this.getHeight(),10),this.headH=.8*this.arrowH,this.bodyW=this.arrowW,this.bodyH=.6*this.arrowH,this.topPadding=-.2*this.arrowH,this.bodyW%2==1&&--this.bodyW,this.arrowBodyEl.style.width=this.bodyW+"px",this.arrowBodyEl.style.height=this.bodyH+"px",this.headStyleArr=[["0px","0px"],["0px "+this.arrowW+"px "+this.headH+"px "+this.arrowW+"px",this.topPadding+"px"],["0px "+this.arrowW+"px "+this.arrowH+"px "+this.arrowW+"px","0px"],["0px","0px"],[this.headH+"px "+this.arrowW+"px 0px "+this.arrowW+"px",this.topPadding+this.bodyH+"px"],[this.arrowH+"px "+this.arrowW+"px 0px "+this.arrowW+"px","0px"],["0px "+this.arrowW+"px "+this.headH+"px "+this.arrowW+"px",this.topPadding+"px"],["0px "+this.arrowW+"px "+this.arrowH+"px "+this.arrowW+"px","0px"],[this.headH+"px "+this.arrowW+"px 0px "+this.arrowW+"px",this.topPadding+this.bodyH+"px"],[this.arrowH+"px "+this.arrowW+"px 0px "+this.arrowW+"px","0px"]],this.bodyStyleArr=["0px","-1px","0px","0px",-1*(this.headH+this.bodyH-2)+"px","0px","-1px","0px",-2*(this.headH+this.bodyH-1)+"px","0px"]},EXTriangle.prototype.setUpDownColor=function(t,r){t=t||this.getAttr("data-color-up")||StockColor.UP_COLOR,r=r||this.getAttr("data-color-down")||StockColor.DOWN_COLOR,this.headColorArr=["transparent transparent transparent","transparent transparent "+t+" transparent","transparent transparent "+t+" transparent","transparent transparent transparent",r+" transparent transparent transparent",r+" transparent transparent transparent","transparent transparent "+t+" transparent","transparent transparent "+t+" transparent",r+" transparent transparent transparent",r+" transparent transparent transparent"],this.bodyColorArr=["transparent",t,"transparent","transparent",r,"transparent",t,t,r,r],this.dir&&this.setDirection(this.dir)},EXTriangle.prototype.setDirection=function(t){t&&!isNaN(t)||(t=0),this.dir=t,this.arrowEl.style.borderColor=this.headColorArr[t],this.arrowEl.style.borderWidth=this.headStyleArr[t][0],this.arrowEl.style.marginTop=this.headStyleArr[t][1],this.arrowBodyEl.style.background=this.bodyColorArr[t],this.arrowBodyEl.style.marginTop=this.bodyStyleArr[t]},EXTriangle.prototype.getDirection=function(){return this.dir},EXTriangle.prototype.setData=function(t){this.setDirection(t)},EXTriangle.prototype.setQueryData=function(t,r,i){r&&null!=(t=t[0][r[0]])&&this.setDirection(t)},EXTriangle.prototype.updatePosition=function(t,r){AComponent.prototype.updatePosition.call(this,t,r),this.isShow()&&0!=this.dir&&3!=this.dir&&(this.initPos(),this.setDirection(this.dir))},EXTriangle.prototype.getMappingCount=function(){return 2},window.EXTriangle=EXTriangle;