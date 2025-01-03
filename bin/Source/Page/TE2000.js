
TE2000 = class TE2000 extends AView
{
	constructor()
	{
		super()

		// 회원 계좌번호
        this.account;
        // nextkey
        this.member_next_key;
        this.transaction_next_key;
        this.log_next_key;
        this.pl_next_key;
        this.dw_next_key;
	}   

	init(context, evtListener)
	{
		super.init(context, evtListener)
        this.start_date.setDate(this.getPrevDate());
        this.start_date.setCalendarIconStyle({
            'cursor' : 'pointer',
        });
        this.end_date.setCalendarIconStyle({
            'cursor' : 'pointer',
        })
        this.tabView.selectTabById('Transaction');
        this.Transaction.element.classList.add('on');
	}

	onInitDone()
	{
		super.onInitDone()

		

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)
        
        this.adminListQuery(); // 관리자 조회


	}
    
  

    // 관리자 조회 쿼리
    adminListQuery() {
        
        theApp.qm.sendProcessByName('TE2000', this.getContainerId(), null,
            function(queryData) { // InBlock 설정
                
            },
            function(queryData) { // OutBlock 처리
                const errorData = this.getLastError();
                if (errorData.errFlag == "E") {
                    console.log("Error Data:", errorData);
                    AToast.show('에러가 발생했습니다.');
                    return;
                }
                const outblock1 = queryData.getBlockData("OutBlock1");
                outblock1.unshift({user_id : "********"});
            },  
        );
    }

    // 회원 조회 쿼리
    getMemberListQuery(next_key){
        const thisObj = this;
        theApp.qm.sendProcessByName('TE2010', this.getContainerId(), null,
            function(queryData) { // InBlock 설정
                // 필요한 경우 InBlock 설정
                
                const inblock1 = queryData.getBlockData('InBlock1')[0];
                if(inblock1.user_id === "********"){
                    inblock1.user_id = 0;
                }
                
                if(next_key){
                    inblock1.next_key = next_key;
                }
              
            },
            function(queryData) { // OutBlock 처리
                const errorData = this.getLastError();
                if (errorData.errFlag == "E") {
                    console.log("Error Data:", errorData);
                    AToast.show('에러가 발생했습니다.');
                    return;
                }

                const outblock1 = queryData.getBlockData('OutBlock1');
                
                if(outblock1.length <= 0){
                    AToast.show("데이터가 없습니다.");
                    return;
                }

                // 마지막 next_key 저장
                if(outblock1.length > 0){
                    thisObj.member_next_key = outblock1[outblock1.length-1].next_key;
                }

                
            }
        );
    }


    // 회원 조회 버튼 클릭
	onMemberCheckBtnClick(comp, info, e)
	{   
        this.memberGrid.removeAll();
        this.getMemberListQuery();

	}

    // 회원 조회 다음 버튼 클릭
	onMemberNextBtnClick(comp, info, e)
	{   
        this.getMemberListQuery(this.member_next_key);

	}

    // 탭뷰 load Btn 클릭
	onTabClick(comp, info, e)
	{
        const key = comp.compId;
        this.tabView.addTab(key, `Source/Sub/${key}.lay`, key);
        this.tabView.selectTabById(key);
        
        const btns = document.querySelectorAll('.historyBtn');
        btns.forEach(btn => {
            btn.classList.remove('on');
        })
        comp.element.classList.add('on');

	}

    // 다음 내역 버튼 클릭
    nextHistoryClick(comp, info, e)
	{

		this.getHistoryListQuery(true);

	}

    // 내역 조회 버튼 클릭
	onhistoryCheckBtnClick(comp, info, e)
	{   
        // 선택된 탭 content의 grid 초기화
        const thisView = this.tabView.getSelectedView();
        const thisGrid = thisView.$ele[0].childNodes[0].acomp;
        thisGrid.removeAll();
        
        // 쿼리실행
        this.getHistoryListQuery();
        
	}

    // 내역 조회 쿼리
    getHistoryListQuery(next){
        const thisObj = this;
        const btns = document.querySelector('.on');
        const queryname = btns.name; // 버튼 name 속성으로 queryName 지정

        theApp.qm.sendProcessByName(queryname, this.getContainerId(), null,
            function(queryData) { // InBlock 설정
                
                const inblock1 = queryData.getBlockData('InBlock1')[0];
                inblock1.acnt_cd = thisObj.account;
                if(next){
                    inblock1.next_key = thisObj.getNextKey(queryname);
                    inblock1.start_date = "0";
                }
                console.log("인블럭",inblock1);
            },
            function(queryData) { // OutBlock 처리
                const errorData = this.getLastError();
                
                if (errorData.errFlag == "E") {
                    console.log("Error Data:", errorData);
                    AToast.show('에러가 발생했습니다.');
                    return;
                }
                
                const outblock1 = queryData.getBlockData('OutBlock1');
                if(outblock1.length > 0){
                    thisObj.setNextKey(outblock1[outblock1.length-1].next_key, queryname);
                }else{
                    AToast.show("데이터가 없습니다.");
                    return;
                }
                
                console.log("아웃블럭",outblock1);
            }
        );
    }

    // 내역별 nextkey getter
    getNextKey(queryname){
        let next_key;
        if(!queryname){
            return;
        }

        switch(queryname){
            case "TE3000" : 
                next_key = this.transaction_next_key
                break;
            case "TE3010" :
                next_key = this.log_next_key
                break;
            case "TE3020" :
                next_key = this.pl_next_key
                break;
            case "TE3030" :
                next_key = this.dw_next_key
                break;
        }
        return next_key;
    }

    // 내역별 nextkey setter
    setNextKey(next_key, queryname){
        
        if(!next_key || !queryname){
            return;
        }
        
        switch(queryname){
            case "TE3000" : 
                this.transaction_next_key = next_key;
                break;
            case "TE3010" :
                this.log_next_key = next_key;
                break;
            case "TE3020" :
                this.pl_next_key = next_key;
                break;
            case "TE3030" :
                this.dw_next_key = next_key;
                break;
            default : "";
        }

    }




    // 더블클릭 조회
	searchHistoryByMember(comp, info, e)
	{   
        // 헤더는 제외
        if(info[0].isHeader){
            return;
        }
        const thisView = this.tabView.getSelectedView();
        const thisGrid = thisView.$ele[0].childNodes[0].acomp;
        thisGrid.removeAll();
        this.getHistoryListQuery();

	}

    // 회원 계좌번호 get
	getAccount(comp, info, e)
	{   
        const account = info.closest('tr').find('td').eq(3).text();
        this.account = account;
	}

   

    // 현 날짜 구하기
    getCurrentDate(){
       
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth()+1;
        const date = today.getDate();

        const todyaObj = {
            year : year,
            month: month,
            day : date,
        }

        return todyaObj;
    }

    // 한달 전 날짜 구하기
    getPrevDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1; // 현재 월 (0부터 시작해서 1을 더해줌)
        const date = today.getDate();

        // 이전 달을 계산
        if (month === 1) {  // 1월인 경우
            month = 12;      // 이전 달은 12월
        } else {
            month -= 1;      // 그 외의 경우는 한 달 빼기
        }

        const prevObj = {
            year: month === 12 ? year - 1 : year, // 12월이면 연도를 한 해 감소
            month: month,
            day: date,
        };

        // 해당 월에 날짜가 유효한지 확인
        const prevDate = new Date(prevObj.year, prevObj.month - 1, prevObj.day); // 월을 0부터 시작하므로 -1
        // 만약 이 날짜가 유효하지 않으면 (예: 2월 30일 같은 날짜), 해당 월의 마지막 날짜로 설정
        prevObj.day = prevDate.getDate();

        return prevObj;
    }

    // 날짜 리셋버튼 클릭
	onDateResetClick(comp, info, e)
	{
        const startDate = this.start_date;
        const endDate = this.end_date;
        const currentDate = this.getCurrentDate();
        const prevDate = this.getPrevDate();

        startDate.setDate(prevDate);
        endDate.setDate(currentDate);
	}

  
   
   


}

