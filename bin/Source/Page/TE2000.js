
TE2000 = class TE2000 extends AView
{
	constructor()
	{
		super()

		// 회원 계좌번호
        this.account;
	}   

	init(context, evtListener)
	{
		super.init(context, evtListener)
        this.start_date.setDate(this.getPrevDate());
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
                console.log(outblock1);
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
        const next_key = "";
        this.getMemberListQuery(next_key);

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

    // 내역 조회 쿼리
	onhistoryCheckBtnClick(comp, info, e)
	{   
        // 선택된 탭 content의 grid 초기화
        const thisView = this.tabView.getSelectedView();
        const thisGrid = thisView.$ele[0].childNodes[0].acomp;
        thisGrid.removeAll();
        
        const thisObj = this;
        const btns = document.querySelector('.on');
        const queryname = btns.name; // 버튼 name 속성으로 queryName 지정

        theApp.qm.sendProcessByName(queryname, this.getContainerId(), null,
            function(queryData) { // InBlock 설정
                
                const inblock1 = queryData.getBlockData('InBlock1')[0];
                inblock1.acnt_cd = thisObj.account;
                
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
                
                console.log("아웃블럭",outblock1);
            }
        );
	}

    // 더블클릭 조회
	searchHistoryByMember(comp, info, e)
	{   
        // 헤더는 제외
        if(info[0].isHeader){
            return;
        }
        this.onhistoryCheckBtnClick();

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
    getPrevDate(){
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth()+1;
        const date = today.getDate();

        const prevObj = {
            year : year,
            month: month-1,
            day : date,
        }

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

