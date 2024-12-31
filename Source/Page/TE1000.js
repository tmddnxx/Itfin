
TE1000 = class TE1000 extends AView
{
	constructor()
	{
		super()

        this.nextKey;
        this.READ_ONLY_MODE_ID = 'unique-lock-id';
	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

		this.createCkEditor(this.noticeContent.element);
        const nav = document.querySelector("[data-class='Nav']");
        const navParent = nav.parentNode.parentNode.parentNode;
        navParent.style.position = 'relative';
        navParent.style.bottom = '0';

        

	}

	onInitDone()
	{
		super.onInitDone()

		//TODO:edit here

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)
        this.loadList();
        this.usernameLabel.setText(this.getUserId() + "님 환영합니다.");
		//TODO:edit here
        
	}

    // 에디터
    createCkEditor(target)
    {
        return ClassicEditor.create(target, {
            language: 'ko',
            extraPlugins: [customUploadAdapterPlugin],
            link: {
            addTargetToExternalLinks: true  // 외부 링크에 자동으로 target="_blank" 추가
            },
            
        })
        .then(editor => {
            editor.editing.view.change(writer => writer.setStyle('height', '100%', editor.editing.view.document.getRoot()))
            editor.editing.view.change(writer => writer.setStyle('min-height', '200px', editor.editing.view.document.getRoot()))
            this.noticeContent = editor;

            const contentRoot = this.contentRoot.element; // 에디터 root
            const resizeHandle = this.resizeHandler.element; // 리사이즈 핸들러
            const mainRoot = this.mainRoot.element;
            let isResizing = false;
            let y = 0;
            let height = 0;
            let mainHeight = mainRoot.offsetHeight;

                // 드래그 시작
            	resizeHandle.addEventListener('mousedown', (e) => {
                    isResizing = true;
                    y = e.clientY; // 마우스 초기 위치
                    height = contentRoot.offsetHeight; // 에디터 부모의 초기 높이
                    mainHeight = mainRoot.offsetHeight; // 그리드 초기 높이

                    document.body.style.cursor = 'ns-resize';
                });
                
                // 드래그중
                document.addEventListener('mousemove', (e) => {
                    if(isResizing){
                        const deltaY = y - e.clientY; // 마우스 이동 거리 (위로 드래그 하도록)
                        const newHeight = height + deltaY; // 높이계산
                        const newMainHeight = mainHeight - deltaY; // 그리드 높이 줄이기

                        if(newHeight > 280 && newMainHeight > 0){ // 에디터(newHeight) 최소높이, 그리드(newMainHeight) 최소높이 지정
                            // 에디터 높이 늘리고, 그리드 높이 줄이기
                            contentRoot.style.height = newHeight + 'px';
                            mainRoot.style.height = newMainHeight + 'px';

                            // 에디터 높이 변경
                            editor.editing.view.change(writer => {
                                writer.setStyle('height', newHeight+'px', editor.editing.view.document.getRoot());
                            })
                        }
                    }
                });

                // 드래그 종료
                document.addEventListener('mouseup', () => {
                    if(isResizing){
                        isResizing = false;
                        document.body.style.cursor = '';
                    }
                })    
        })
        .catch(console.error);

        function customUploadAdapterPlugin(editor) {
            editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                return new UploadAdapter(loader, `${config.SERVER_ADDRESS}:${config.SERVER_PORT}/upload`);
            };
        }
    }

    // 세션에서 userId 가져오기
    getUserId(){
        const userId = sessionStorage.getItem('userId');
        if(!userId){
            return null;
        }
        return userId;
    }

    // 다음버튼 클릭
    onNextBtnClick()
	{   
		this.loadList(this.nextKey);

	}
    // 조회 버튼클릭
    onCheckBtnClick(){
        this.boardGrid.removeAll();
        this.loadList();
    }
    
    
    
    // 게시물 type별 전체조회 
    loadList(nextKey){
        
        const thisObj = this;
        
        theApp.qm.sendProcessByName('TE1000', this.getContainerId(), null,
        function(queryData)
        { // InBlock 설정
            const inblock1 = queryData.getBlockData('InBlock1')[0];
            if(nextKey) {
                inblock1.next_key = nextKey;        
            }
            
        },
        function(queryData)
        { // OutBlock 처리
            
            const errorData = this.getLastError();
            if (errorData.errFlag == "E") {
                console.log("Error Data:", errorData);
                AToast.show('에러가 발생했습니다.');
                return;
            }
          
            const outblock1 = queryData.getBlockData("OutBlock1");
            
            // 마지막 next_Key 저장
            if(outblock1.length > 0){
                const nextKey = outblock1[outblock1.length-1].next_key;
                thisObj.nextKey = nextKey;
            }  
        })
        
        this.title.setText("");
        this.selectBox.selectItem(0);
        this.indexField.setText("");
        this.noticeContent.setData("");
        
    }

    // upsert query
    upsertQuery(queryName){

        const title = this.title.getText();
		const content = this.noticeContent.getData(); 
        const thisObj = this;

        // 빈칸 valid 
        if(!title || !content){
            AToast.show("빈칸을 입력해주세요.");
            return;
        }

        theApp.qm.sendProcessByName(`${queryName}`, this.getContainerId(), null,
        function(queryData)
        { // InBlock 설정
            const inblock1 = queryData.getBlockData('InBlock1')[0];
            
            inblock1.notice_content = content;
           
            
        },
        function(queryData)
        { // OutBlock 처리
            const errorData = this.getLastError();
            if(errorData.errCode === "ER_DATA_TOO_LONG"){
                AToast.show("본문은 1024자 이내여야 합니다.");
                return;
            }
            if (errorData.errFlag == "E") {
                console.log("Error Data:", errorData);
                AToast.show('에러가 발생했습니다.');
                return;
            }
            
            const outblock1 = queryData.getBlockData("OutBlock1");
            
            if ( outblock1[0].success_status !== 'Y' ) {
                AToast.show('다시 시도해주세요');
                return;
            }else{
                thisObj.boardGrid.removeAll();
                thisObj.loadList(null);
                return true;
            }
        });

        return false;
    }


    // 추가버튼
	onAddBtnClick(comp, info, e)
	{   
        this.upsertQuery('TE1011');
	}

    // row 개별 선택
	onBoardGridDblclick(comp, info, e)
	{
        const isHead = this.boardGrid.isHeadCell(info);
        if(isHead) { // 헤더인경우 이벤트 막기
            e.preventDefault();
            return;
        }

        const thisObj = this;
        const row = info.find('td');
        const index = row[0].innerText;

        thisObj.getOneQuery(index);
        
	}

    // 개별조회 쿼리
    getOneQuery(index) {
        const thisObj = this;
        thisObj.title.setReadOnly(false);
        thisObj.selectBox.element.disabled = false;
        thisObj.noticeContent.disableReadOnlyMode(thisObj.READ_ONLY_MODE_ID);

        return new Promise((resolve, reject) => {
            // getOne query
            theApp.qm.sendProcessByName('TE1010', this.getContainerId(), null,
            function(queryData) { // InBlock 설정
                const inblock1 = queryData.getBlockData('InBlock1')[0];
                inblock1.notice_id = parseInt(index);
            },
            function(queryData) { // OutBlock 처리
                const errorData = this.getLastError();
                if (errorData.errFlag == "E") {
                    console.log("Error Data:", errorData);
                    AToast.show('에러가 발생했습니다.');
                    return reject(errorData); // 에러를 반환
                }

                const outblock1 = queryData.getBlockData("OutBlock1")[0];
                
                // 선택한 항목 설정
                thisObj.selectBox.selectItemByText(thisObj.typeFormat(outblock1.notice_type));
                thisObj.noticeContent.setData(outblock1.notice_content);

                // 내가 쓴 글만 수정, 삭제 되도록
                const isDisabled = outblock1.upd_user_id !== thisObj.getUserId();
                const btns = [thisObj.modifyBtn, thisObj.removeBtn];

                btns.forEach(btn => {
                    btn.enable(!isDisabled);
                    isDisabled ? btn.changeBtnState(AButton.DISABLE) : btn.clearStateClass();
                });

                if(isDisabled){
                    thisObj.title.setReadOnly(true);
                    thisObj.selectBox.element.disabled = true;
                    thisObj.noticeContent.enableReadOnlyMode(thisObj.READ_ONLY_MODE_ID);
                }

                // 정상적으로 outblock1을 반환
                resolve(outblock1);
            });
        });
    }


    // 수정버튼 클릭
	modifyBtnClick(comp, info, e)
	{
		this.upsertQuery('TE1012');
	}

    // 게시물 삭제처리
    remove(data){
        this.boardGrid.removeAll();

        // remove query
		theApp.qm.sendProcessByName('TE1013', this.getContainerId(), null,
        function(queryData)
        { // InBlock 설정
            const inblock1 = queryData.getBlockData('InBlock1')[0];
            if(data){
                inblock1.notice_id = data;
            }
            
        },
        function(queryData)
        { // OutBlock 처리
            const errorData = this.getLastError();
            if (errorData.errFlag == "E") {
                console.log("Error Data:", errorData);
                AToast.show('에러가 발생했습니다.');
                return;
            }
            
            const outblock1 = queryData.getBlockData("OutBlock1");

            if ( outblock1[0].success_status !== 'Y' ) {
                AToast.show('다시 시도해주세요');
                return;
            }
            
        });
        
    }
    

    //삭제버튼 클릭 ( 다중 선택 및 삭제 처리)
	async removeBtnClick()
	{   
        // 선택 row들 가져옴
        const rows = this.boardGrid.getSelectedCells();
        const indexArr = []; // index 담을 배열
        // 사용자
        const userId = this.getUserId();

        // 각 row의 인덱스가져오기
        rows.forEach(row =>{
            indexArr.push(row[0].cells[0].innerText);
        })
		
        for(const index of indexArr){
            const outblock = await this.getOneQuery(index);
            if(outblock.upd_user_id !== userId){
                AToast.show("본인이 작성한 글만 삭제할 수 있습니다.");
                return;
            }
            this.remove(index);// 삭제메서드    
        }
        this.loadList(); // 목록 재조회
	}

    // 상세보기 버튼 클릭
	detailBtnClick(comp, info, e)
	{   
        const index = this.indexField.getText();
        const title = this.title.getText();
        const type = this.selectBox.getSelectedItemValue();
        const content = this.noticeContent.getData();
        
        if(!index || !title || !type || !content){
            AToast.show('게시물을 먼저 선택해주세요');
            return;
        }

        // 선택 데이터
        const selectData = {
            index : index,
            title : title,
            type : type,
            content : content,
        }
		const window = new AWindow('detail_Modal');
        window.setOption({
            isModal: true, // 모달
            isCenter: true, // 중앙배치
            isFocusLostClose: true, // 포커스 잃을때 창 닫기
            modalBgOption : 'light' // 배경 흐리게
        })
        window.setData(selectData);
        window.openAsDialog('Source/Window/Detail.lay', this.getContainer(), 900, 900);


	}

    // 날짜 리셋버튼 클릭
	onDateResetClick(comp, info, e)
	{
        const startDate = this.start_date;
        const endDate = this.end_date;
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth()+1;
        const date = today.getDate();

        const todyaObj = {
            year : year,
            month: month,
            day : date,
        }

        startDate.setDate(todyaObj);
        endDate.setDate(todyaObj);
	}

    // 타입 value -> 문자열 포맷
    typeFormat(type) {
        switch (type) {
            case "1":
                return "공지";
            case "2":
                return "긴급";
            case "3":
                return "뉴스";
            case "4":
                return "시스템";
            default:
                return "Unknown"; 
        }
    }




}

