
/**
Constructor
Do not call Function in Constructor.
*/
function itemView()
{
	AView.call(this);

	this.data = null;

}
afc.extendsClass(itemView, AView);


itemView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//TODO:edit here

};

itemView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//TODO:edit here

};

itemView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

itemView.prototype.setData = function(data){ // 리스트 아이템 뷰에 데이터 추가

	this.data = data;
	
	this.listViewLabel.setText(data.title);
};

