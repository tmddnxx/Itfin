
/*
* ADataMask 사용자 정의 파일
*/
if(!ADataMask.queryFmt) ADataMask.queryFmt = {};
ADataMask.queryFmt.typeFmt =
{
	title : "구분 설정",
	param : [], //마스크 등록 시 입력할 파라미터 정의
	func : function funcName(value, param, ele, dataObj)
	{
		// value: 마스킹 할 대상 값(query 를 등록했을 경우 매핑한 필드의 값이 넘어옴)
		// param: 마스크 등록 시 입력한 값이 배열로 넘어옴
		// ele: 마스크를 매핑한 엘리먼트
		// dataObj: 마스킹에 필요한 추가 데이터 (ADataGrid 에서 사용)
		// ADataMask.getQueryData() : [data, keyArr, queryData]
		// --> query 파일 매핑시, 매핑한 필드와 수신한 데이터를 위와 같이 얻어올 수 있다.

		// 리턴값이 마스킹 결과 값이 됨
        switch (value) {
            case "1": value = "공지"
                break;
            case "2": value = "긴급"
                break;
            case "3": value =  "뉴스"
                break;
            case "4": value = "시스템";
                break;
            default: value = "Unknown"
                break;
        }

        return value;
	}
};

ADataMask.queryFmt.dateFmt =
{
	title : "업데이트 날짜 설정",
	param : [], //마스크 등록 시 입력할 파라미터 정의
	func : function funcName(value, param, ele, dataObj)
	{
        if(value){
            return value.split(" ")[0];
        }
        return value;
	}
};

ADataMask.queryFmt.contentFmt = 
{
    title : "content 포맷",
	param : ["type"], //마스크 등록 시 입력할 파라미터 정의
	func : function funcName(value, param, ele, dataObj)
	{
        
        // <p>&nbsp;</p> 태그 제거
        value = value.replaceAll('<p>&nbsp;</p>', '');

        // figureType 설정: 이미지 또는 테이블 확인
        let figureType = getFigureType(value);

        // 'title' 파라미터인 경우
        if (param[0] === 'title') {
            return truncateTitle(value);
        }

        // <figure> 태그가 포함되어 있으면 상세보기 표시
        if (value.includes('<figure')) {
            value = handleFigureTag(value, figureType);
        }

        // 텍스트 길이가 100자를 초과하면 생략 처리
        return truncateText(value);
	}
}

ADataMask.queryFmt.color = 
{
    title: "사용여부 N",
    param: [],
    func: function funcName(value, param, ele, dataObj)
    {
        if(value === 'N'){
            ele.parentNode.style.color = 'red';
            value = "미사용";
        }else{
            value = "사용";
        }

        return value;
    }
}

ADataMask.queryFmt.sellbuy_type = 
{
    title: "매도매수구분",
    param: [],
    func: function funcName(value, param, ele, dataObj)
    {   
            switch(value){
            case "1" :
                value = "매도"
                break;
            case "2" : 
                value = "매수"
                break;
        }

        return value;
    }
}

ADataMask.queryFmt.ord_type = 
{
    title: "호가유형",
    param: [],
    func: function funcName(value, param, ele, dataObj)
    {   
            switch(value){
            case "1" :
                value = "시장가"
                break;
            case "2" : 
                value = "지정가"
                break;
        }

        return value;
    }
}

ADataMask.queryFmt.ord_action = 
{
    title: "신규정정취소구분",
    param: [],
    func: function funcName(value, param, ele, dataObj)
    {   
            switch(value){
            case "1" :
                value = "신규"
                break;
            case "2" : 
                value = "정정"
                break;
            case "3" : 
                value = "취소"
            break;
        }

        return value;
    }
}

ADataMask.queryFmt.trsc_type = 
{
    title: "이체구분",
    param: [],
    func: function funcName(value, param, ele, dataObj)
    {   
            switch(value){
            case "D" :
                value = "입금"
                break;
            case "W" : 
                value = "출금"
                break;
        }

        return value;
    }
}



// figureType 설정
function getFigureType(value) {
    if (value.includes('table')) {
        return '테이블';
    } else if (value.includes('img')) {
        return '이미지';
    }
    return ''; // 기본값
}

// 제목 길이 제한 처리
function truncateTitle(value) {
    return value.length > 30 ? value.substring(0, 30) + "..." : value;
}

// <figure> 태그 처리
function handleFigureTag(value, figureType) {
    const findex = value.indexOf('<figure');
    if (findex !== -1) {
        if (!value.startsWith('<figure')) {
            return value.substring(0, findex) + ` <span>${figureType} 상세보기...</span>`;
        } else {
            return `${figureType} 상세보기...`;
        }
    }
    return value;
}

// 텍스트 길이 제한 처리
function truncateText(value) {
    return value.length > 100 ? value.substring(0, 100) + "..." : value;
}