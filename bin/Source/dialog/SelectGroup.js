
SelectGroup = class SelectGroup extends AView
{
	constructor()
	{
		super()

		//TODO:edit here

	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

        const list = this.getItemFromLocal('groupList');
        // select박스 설정
        for(const item of list){
            this.groupSelectBox.insertItem(item);
        }
        
	}

	onInitDone()
	{
		super.onInitDone()

		//TODO:edit here

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

       
		
	}

    getItemFromLocal(key){
        const list = localStorage.getItem(key);

        if(!list){
            return [];
        }

        return JSON.parse(list);
    }
    
    // 확인버튼
	onOkBtnClick(comp, info, e)
	{
        const value = this.groupSelectBox.getSelectedItemText();
        
        this.getContainer().close(value);
	}
    
    // 취소버튼
	onCancelBtnClick(comp, info, e)
	{
		this.getContainer().close();
	}




}

