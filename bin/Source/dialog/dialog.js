
dialog = class dialog extends AView
{
	constructor()
	{
		super()

		//TODO:edit here

	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

		//TODO:edit here

	}

	onInitDone()
	{
		super.onInitDone()

		//TODO:edit here

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)
        this.nameText.setFocus();
		//TODO:edit here
        if(this.getContainerId() === 'modify'){
            this.nameText.setText(this.getContainer().getData().nodeValue);
        }
	}

    // 로컬스토리지에서 list 가져오기
    getItemFromLocal(key){
        const list = localStorage.getItem(key);

        if(!list){
            return []; // 리스트가 없으면 빈 배열 반환
        }

        return JSON.parse(list);
    }


    // 취소버튼 (close)
	onCancelBtnClick(comp, info, e)
	{
        this.getContainer().close();
	}

    // 확인 버튼 
	onOkBtnClick(comp, info, e)
	{
        const text = this.nameText.getText();
        const groupList = this.getItemFromLocal('groupList');
        let isValid = false;
        // 중복검사
        groupList.forEach(item => {
            if(text === item){
                isValid = true;
            }
        })

        // 빈칸검사
        if(!text){
            AToast.show("이름을 입력해주세요");
            this.nameText.setFocus();
            return;
        }
        if(isValid){
            AToast.show("이름이 중복되었습니다.");
            this.nameText.setFocus();
            return;
        }

		this.getContainer().close(text);
	}

    // 엔터키만 허용
	onNameTextKeydown(comp, info, e)
	{

        if(e.key === 'Enter'){
            e.stopPropagation();
            this.onOkBtnClick();
        }else if(e.keyCode === 27){ // esc 닫기
            e.stopPropagation();
            this.onCancelBtnClick()
        }else{
            e.stopPropagation();
            return;
        }

	}
}

