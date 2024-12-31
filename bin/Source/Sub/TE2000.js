
TE2000 = class TE2000 extends AView
{
	constructor()
	{
		super()

		//TODO:edit here
        this.obj = [];
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
        this.selectBox.setItemValue(0, 0);
        
    }

    // 회원 조회
	onMemberCheckBtnClick(comp, info, e)
	{
        this.memberGrid.removeAll();
        theApp.qm.sendProcessByName('TE2010', this.getContainerId(), null,
            function(queryData) { // InBlock 설정
                // 필요한 경우 InBlock 설정
                
                const inblock1 = queryData.getBlockData('InBlock1')[0];
                if(inblock1.user_id === "********"){
                    inblock1.user_id = 0;
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
            }
        );

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

  
}

