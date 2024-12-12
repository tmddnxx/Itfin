
/**
Constructor
Do not call Function in Constructor.
*/
class itemView()
{
	super();

	this.data = null;

}
extends AView;


function itemView*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function itemView*onInitDone()
{
	super.onInitDone();

	//TODO:edit here

};

function itemView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function itemView*setData(data){ // 리스트 아이템 뷰에 데이터 추가

	this.data = data;
	
	this.listViewLabel.setText(data.title);
};

