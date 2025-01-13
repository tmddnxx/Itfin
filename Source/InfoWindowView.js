
InfoWindowView = class InfoWindowView extends AView
{
	constructor()
	{
		super()

		//TODO:edit here
        this.data;
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
        this.data = this.getContainer().getData(); // 주식코드
	
        this.stockName.setText(this.data.name);
        this.loadInfo(); // 시세정보 api 요청

	}

    // 시세정보 불러오기
    async loadInfo(period){
        const {date, numOfRows} = this.subtractDate(period);
        
        const baseUrl = `${config.INFO_BASE_URL}/${config.INFO_REQUEST_URL}?serviceKey=${encodeURIComponent(config.SERVICE_KEY)}&resultType=json&numOfRows=${numOfRows}&likeSrtnCd=${(this.data).code}&beginBasDt=${date}&endBasDt=${this.getToday()}`
        
        let responseCopy;

        try{
            AIndicator.show();
            const response = await fetch(baseUrl);
            responseCopy = response.clone();
            const result = await response.json();
            const data = result.response;
            const body = data.body.items.item; // items
            
            this.drawChart(body, period);

        }catch(e){
            if (responseCopy) {
                const contentType = responseCopy.headers.get('Content-Type');
                
                if (contentType && contentType.includes('text/xml')) {
                    // 응답이 XML일 경우, XML을 읽고 JSON으로 변환
                    const xmlText = await responseCopy.text();
                    const jsonResponse = parseXMLToJSON(xmlText);  // XML을 JSON으로 변환
                    
                    // 에러코드 추출
                    const errCode = jsonResponse.OpenAPI_ServiceResponse.cmmMsgHeader.returnReasonCode['#text'];
                    // 에러 alert
                    AToast.show(`${apiError[errCode]}`);
                }
            }
        }finally{
            AIndicator.hide();
        }
        
    }

    // 차트그리기
    drawChart(body, period){
        const chart = this.chart;  
        
        const data = body.map(item => ({
            time: item.basDt,           
            open: parseInt(item.lopr),  
            high: parseInt(item.hipr),  
            low: parseInt(item.lopr),   
            close: parseInt(item.clpr), 
            volume: parseInt(item.trqu) 
        }));
        
        const keys = ['time', 'open', 'high', 'low', 'close', 'volume'];
        chart.reCalcWidth(body.length);
        if(period === '5year'){
            chart.reCalcWidth(500);
        }
         
        chart.setData(data, keys);
    }


    // endBasDt (오늘날짜)
    getToday(){
        let today = new Date();
        let formattedDate = today.toISOString().slice(0, 10).replace(/-/g, '');
        return formattedDate;
    }
    
    // 날짜를 yyyyMMdd 형식으로 포맷하는 함수
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    // 특정 기간만큼 날짜를 빼는 함수
    subtractDate(period = 'week') {
        const today = new Date();
        let numOfRows = 10; // 기본적으로 10개씩 요청

        switch (period) {
            case 'week': // 1주일 전
                today.setDate(today.getDate() - 7); // 5개
                numOfRows = 5;
                break;
            case 'month': // 1개월 전
                today.setMonth(today.getMonth() - 1); // 20개
                numOfRows = 20;
                break;
            case '3month': // 3개월 전
                today.setMonth(today.getMonth() - 3); // 60개
                numOfRows = 60;
                break;
            case 'year': // 1년 전
                today.setFullYear(today.getFullYear() - 1); // 240개
                numOfRows = 240;
                break;
            case '5year': // 5년 전
                today.setFullYear(today.getFullYear() - 5); // 1200개
                numOfRows = 1200;
                break;
        }

        // 만약 조정된 날짜가 유효하지 않으면 날짜를 1일로 설정
        const adjustedDate = new Date(today);
        if (adjustedDate.getDate() !== today.getDate()) {
            today.setDate(1);
        }

        return { date: this.formatDate(today), numOfRows }; // 날짜와 numOfRows를 반환
    }

    // 날짜라벨 클릭
	dateLabelClick(comp, info, e)
	{
        const labels = document.querySelectorAll('.dateBtn');
        labels.forEach(label => {
            label.classList.remove('click');
        })
        comp.element.classList.add('click');

        this.loadInfo(comp.compId);
	}
}

