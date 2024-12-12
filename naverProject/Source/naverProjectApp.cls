
/**
Constructor
Do not call Function in Constructor.
*/
class naverProjectApp()
{
	super();
}
extends AApplication;


function naverProjectApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/PageView/naverProjectLsw.lay');
	
	
};

function naverProjectApp*unitTest(unitUrl)
{
	this.onReady();

	super.unitTest(unitUrl);
};
