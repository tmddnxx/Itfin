
MainView = class MainView extends AView
{
	constructor()
	{
		super()

		
        this.size = 1000;
        this.page = 1;
        this.isCheck = false; // 조회버튼 클릭 후 다음버튼 클릭하도록
        this.btnCheck = false; // 연쇄버튼작용  막도록
        this.searchData = {};
        this.selectData = []; 
        
        this.data = []; // 조회목록 ( 정렬 )
        
        this.rows;
        this.pageNo;
        this.totalCnt;

        // 드래그 옵션지정시 getRows 매개변수
        this.startIdx = 0;
        this.endIdx = 0;

        // 브라우저 해상도 조절여부
        this.isResizing = false;
	}

	init(context, evtListener)
	{
		super.init(context, evtListener)
        
        
	}

	onInitDone()
	{
		super.onInitDone()
        
		//TODO:edit here

	}

	onActiveDone(isFirst)
	{
        super.onActiveDone(isFirst)
        this.setDefaultGroup(); // 관심종목 001 기본값 설정
        
        this.getGroupList('groupList'); // 관심그룹 불러오기
        this.basDt.setDate(this.getCurrentDate());
        this.basDt2.setDate(this.getCurrentDate());


        // 조회버튼 누르고 다음 버튼 누르도록
        this.nextBtn.enable(this.isCheck);
        this.nextBtn2.enable(this.isCheck);

        this.createSortIcon(); // 그리드 헤더 정렬아이콘 생성
        
        this.loadAllList(); // 기본 조회
        this.drawKospi();   // 헤더 코스피차트
        this.drawKosdaq(); // 헤더 코스닥차트

        // this.preventResizeScrollFunc();
        
	}
    
    // 브라우저 리사이징시 스크롤이벤트 막기
    // preventResizeScrollFunc(){
    //     const thisObj = this;
    //     window.addEventListener('resize', function() {
    //         thisObj.isResizing = true;

    //         setTimeout(function() {
    //             thisObj.isResizing = false;
    //         }, 500);
    //     })
    // }

    // 헤더 코스피차트
    async drawKospi(){
        const baseUrl = `${config.KOSPI_BASE_URL}/${config.KOSPI_REQUEST_URL}?serviceKey=${encodeURIComponent(config.SERVICE_KEY)}&resultType=json&pageNo=1&numOfRows=50&idxNm=코스피`
        const kospi = this.kospiChart;
        try{
            const response = await fetch(baseUrl);
            const result = await response.json();
            const items = result.response.body.items.item; // 사용할 데이터

            const keys = ['time', 'open', 'high', 'low', 'close', 'volume'];
            const data = items.map(item => ({
                time: item.basDt,           
                open: parseInt(item.lopr),  
                high: parseInt(item.hipr),  
                low: parseInt(item.lopr),   
                close: parseInt(item.clpr), 
                volume: parseInt(item.trqu) 
            }))
            kospi.TEXT_SET = [];
            kospi.reCalcWidth(items.length);
            kospi.setData(data, keys);
        }catch(e){
            kospi.element.parentNode.style.display = 'none';    
        }
       

    }

    // 헤더 코스닥차트
    async drawKosdaq(){
        const baseUrl = `${config.KOSPI_BASE_URL}/${config.KOSPI_REQUEST_URL}?serviceKey=${encodeURIComponent(config.SERVICE_KEY)}&resultType=json&pageNo=1&numOfRows=50&idxNm=코스닥`
        const kosdaq = this.kosdaqChart;
        try{
            const response = await fetch(baseUrl);
            const result = await response.json();
            const items = result.response.body.items.item; // 사용할 데이터
            
            const keys = ['time', 'open', 'high', 'low', 'close', 'volume'];
            const data = items.map(item => ({
                time: item.basDt,           
                open: parseInt(item.lopr),  
                high: parseInt(item.hipr),  
                low: parseInt(item.lopr),   
                close: parseInt(item.clpr), 
                volume: parseInt(item.trqu) 
            }))
            kosdaq.TEXT_SET = [];
            kosdaq.reCalcWidth(items.length);
            kosdaq.setData(data, keys);

        }catch(e){
            // 에러발생시 요소 숨김
            kosdaq.element.parentNode.style.display = 'none'; 
        }
        

    }
    
    // 로컬스토리지에 list 저장 
    addItemsToLocal(key, items, type, idx){
        const list = this.getItemFromLocal(key);
        
        if(type === 'add'){
            list.push(items);
        }else if(type === 'modify'){
            list[idx] = items;
        }else if(type === 'remove'){
            list.splice(idx, 1);
        }
        
        localStorage.setItem(key, JSON.stringify(list));
        
    }

    // 로컬스토리지에서 list 가져오기
    getItemFromLocal(key){
        const list = localStorage.getItem(key);
        
        if(!list){
            return []; // 리스트가 없으면 빈 배열 반환
        }

        return JSON.parse(list);
    }

    // 기본 api 요청
    async loadAllList(searchData, page){

        // 버튼 연쇄작용, 중복요청 막기
        if(this.btnCheck){
            AToast.show("조회 요청 중 입니다.");
            return;
        } 

        this.btnCheck = true;

        const baseUrl = `${config.BASE_URL}/${config.REQUEST_URL}?serviceKey=${encodeURIComponent(config.SERVICE_KEY)}&resultType=json&`
        // 기본 쿼리파라미터
        const params  = new URLSearchParams({
            numOfRows : this.size,
            pageNo : page ?? 1,
        })

        
        // 검색할땐 파라미터 추가
        if(searchData && Object.keys(searchData).length > 0){ // 검색데이터가 존재하면 
            params.append(searchData.type, searchData.text);
            params.append("basDt", searchData.basDt);
        }else{ // 첫 자동조회 후 다음페이지는 기본값으로 전달
            params.append("basDt", `${this.getCurrentDate().year}${this.getCurrentDate().month}${this.getCurrentDate().day}`);
        }
        
        let responseCopy;
        try{
            AIndicator.show();
            const response = await fetch(`${baseUrl}${params}`);
            responseCopy = response.clone();
            const data = await response.json();
            const result = data.response;
            const body = result.body;
            const items = body.items.item;    

            this.rows = body.numOfRows;
            this.pageNo = body.pageNo;
            this.totalCnt = body.totalCount;
            
            // 동일종목 최신데이터로 필터링
            const filterItems = [...items].reduce((acc, item) =>{
                if(!acc.has(item.srtnCd)){
                    acc.set(item.srtnCd, item);
                }else{
                    const existItem = acc.get(item.srtnCd);
                    if(new Date(item.basDt) > new Date(existItem.basDt)){
                        acc.set(item.srtnCd, item);
                    }
                }
                return acc;
            }, new Map());

            

            const filterArray = Array.from(filterItems.values());
            
            this.data.push(...filterArray);
            
            if(items.length === 0){
                AToast.show("검색 결과가 없습니다.");
                return;
            }else{
                (this.page)++;
                this.addRows(filterArray);   
            }

            if(this.existNext(this.rows, this.pageNo, this.totalCnt)){
                this.nextBtn.enable(true);
                this.nextBtn2.enable(true);
            }else{
                this.nextBtn.enable(false); // 다음버튼 비활성화
                this.nextBtn2.enable(false);
            }
        }
        catch(e){ // 에러처리 (api 에러는 xml => json parse 실패시 실행)
            
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
        }
        finally {
            this.btnCheck = false;
            this.isCheck = true;

            AIndicator.hide();
            this.gridRowCheck(); // 모든 row 체크박스 
        }
    }
    
    /* 그리드 정렬버튼 생성 */
    createSortIcon(){
         
        const thisObj = this;
        const head_market = $('.head-prop').find('td')[4];
        const head_date = $('.head-prop').find('td')[1];
        const head_name = $('.head-prop').find('td')[5];
        const head_check = $('.head-prop').find('td')[0];

        // 체크박스
        const head_checkbox = $('<input>').addClass('gridCheckbox');
        $(head_checkbox).attr('id', 'head_checkbox');  
        $(head_checkbox).attr('type', 'checkbox'); 
        $(head_checkbox).on('click', function(){
            thisObj.gridHeadCheck(); // 헤더 체크박스 체크시 row의 체크박스도 체크됨
        })
        $(head_checkbox).on('change', function(){
            if ($(this).prop('checked')) {
                $(this).addClass('checked');  // 체크되었을 때 'checked' 클래스 추가
            } else {
                $(this).removeClass('checked');  // 체크 해제되었을 때 'checked' 클래스 제거
            }
        })

        $(head_check).append(head_checkbox);

        // 시장종류 정렬 버튼
        const market_sortBtn = $('<button></button>').addClass('mkSortBtn');
        $(market_sortBtn).on('click', function() {
            $(market_sortBtn).toggleClass('isFirst'); // 클래스 토글
            thisObj.onSortClick('market', $(market_sortBtn).hasClass('isFirst')); // 클릭 시 정렬
        });

        // // 날짜 정렬 버튼
        // const date_sortBtn = $('<button></button>').addClass('mkSortBtn');
        // $(date_sortBtn).on('click', function() {
        //     $(date_sortBtn).toggleClass('isFirst'); // 클래스 토글
        //     thisObj.onSortClick('date', $(date_sortBtn).hasClass('isFirst')); // 클릭 시 정렬
        // });

        // 종목명 정렬 버튼
        const name_sortBtn = $('<button></button>').addClass('mkSortBtn');
        $(name_sortBtn).on('click', function() {
            $(name_sortBtn).toggleClass('isFirst'); // 클래스 토글
            thisObj.onSortClick('name', $(name_sortBtn).hasClass('isFirst')); // 클릭 시 정렬
        });

        $(head_market).append(market_sortBtn);
        // $(head_date).append(date_sortBtn);
        $(head_name).append(name_sortBtn);

        const $grid = this.grid.get$ele();
        $($grid).on('dragover', e => {
            e.preventDefault();
        })
        $($grid).on('drop', e => {
            e.preventDefault();
            const index = e.originalEvent.dataTransfer.getData('text/html');
            const menu = e.originalEvent.dataTransfer.getData('text/plain');
            if(!index || !menu){ // 카드 인덱스번호
                return;
            }
            
            thisObj.removeItems(menu, [index]);
        })

        
    }

    // 그리드 헤더 체크박스
    gridHeadCheck(){
        const head_checkbox = document.getElementById('head_checkbox'); 
        const isChecked = head_checkbox.checked;
        const checkboxes = document.querySelectorAll('.gridCheckBox');
        const thisObj = this;

        checkboxes.forEach(chkBox => {
            chkBox.checked = isChecked;
            
            const row = chkBox.parentNode.parentNode.childNodes;
                
            const selectData = {
                market : row[4].innerText,
                name : row[5].innerText,
                code : row[2].innerText,
            }
            
            if(chkBox.checked){
                const isAlreadySelected = thisObj.selectData.some(item => item.code === selectData.code);
                if (!isAlreadySelected) {
                    thisObj.selectData.push(selectData);
                }
            }else{
                thisObj.selectData = thisObj.selectData.filter(item => item.code !== selectData.code);
            }
            
        })
        
        
    }

    // 정렬버튼 
    onSortClick(type, isFirst)
    {   
		this.marKetSortArray(type, isFirst);
	}

    // 시장종류 기준 정렬
    marKetSortArray(type, isFirst){
        
        AIndicator.show();
        try {
            // 시장종류 우선순위 설정
            const marketPriority = {
                "KOSPI": 1,
                "KOSDAQ": 2,
                "KONEX": 3
            };

            const compare = (a, b) => {
                switch (type) {
                    case 'market':
                        // 시장 종류 기준 정렬
                        return isFirst 
                            ? marketPriority[a.mrktCtg] - marketPriority[b.mrktCtg]
                            : marketPriority[b.mrktCtg] - marketPriority[a.mrktCtg];

                    case 'date':
                        // 날짜 기준 정렬 (basDt)
                        const dateA = new Date(a.basDt.slice(0, 4) + '-' + a.basDt.slice(4, 6) + '-' + a.basDt.slice(6, 8));
                        const dateB = new Date(b.basDt.slice(0, 4) + '-' + b.basDt.slice(4, 6) + '-' + b.basDt.slice(6, 8));
                        return isFirst ? dateA - dateB : dateB - dateA;

                    case 'name':
                        // 종목명 기준 정렬 (itmsNm)
                        return isFirst
                            ? a.itmsNm.localeCompare(b.itmsNm)
                            : b.itmsNm.localeCompare(a.itmsNm);

                    default:
                        return 0; // type이 예상되지 않으면 기본값
                }
            };

            this.data.sort(compare);
            
            this.grid.removeAll();
            this.addRows(this.data);
        } finally {
            AIndicator.hide();
        }
    }

    // 다음페이지 존재여부
    existNext(rows, page, totalCnt){
        return (rows * page) < totalCnt;
    }

    // 행추가
    addRows(array){
        
        const newOrder = [
            "checkBox", "basDt", "srtnCd", "isinCd", 
            "mrktCtg", "itmsNm", "crno", "corpNm"
        ];

        array.forEach(item => {
            item.checkBox = '체크박스';
        });

        array.forEach((item, index) => {
            const reordered = {};  

            newOrder.forEach(key => {
                if (item.hasOwnProperty(key)) {
                    reordered[key] = item[key];  
                }
            });

            array[index] = reordered;
        });
        
        for(let i=0; i<array.length; i++){
            
            this.grid.addRow(Object.values(array[i]));
        }
        
        // 첫실행
        if(this.endIdx === 0){
            this.endIdx = array.length - 1;
        }

        // rows들 드래그가능토록
        let rows = this.grid.getRows(this.startIdx , this.endIdx + 1);
    
        // 드래그 이벤트
        rows.each(function(){
            $(this).prop('draggable', 'true');
            $(this).on('dragstart', e => {
                const data = {
                    market : e.currentTarget.childNodes[3].innerText,
                    name : e.currentTarget.childNodes[4].innerText,
                    code : e.currentTarget.childNodes[1].innerText,
                }
                
                e.originalEvent.dataTransfer.setData('application/json', JSON.stringify(data));
            })
        })
        
        this.startIdx = this.endIdx + 1;
        this.endIdx = this.startIdx + array.length -1;

        
    }

    // 조회버튼
	onCheckBtnClick(comp, info, e)
	{   
        let type, text, basDt;

        if(!comp.compId){ // 반응형 검색
            type = this.selectBox2.getSelectedItemValue();
            text = this.searchInput2.getText();
            basDt = this.basDt2.getDateString();
        }else{
            type = this.selectBox.getSelectedItemValue();
            text = this.searchInput.getText();
            basDt = this.basDt.getDateString();
        }

        this.startIdx = 0;
        this.endIdx = 0;
        this.page = 1;
        

        const searchObj = {
            type : type,
            text : text,
            basDt: basDt,   
        }

        this.searchData = searchObj;

        this.grid.removeAll(); // 그리드 초기화
        this.loadAllList(searchObj, this.page);
        this.isCheck = true;
	}

    
    // 다음 버튼 ( 조회할때 들어있던 데이터 값을 계속 사용 )
	onNextBtnClick(comp, info, e)
	{   
        if(!this.isCheck){
            AToast.show("조회 해주세요.");
            return;
        }
      
        this.loadAllList(this.searchData, this.page);
	}

    // 검색어 keydown 이벤트
    onSearchInputKeydown(comp, info, e){
        
        if(e.key === 'Enter'){
            let newComp = {compId : comp.compId};
            if(comp.compId === 'searchInput2'){ // 반응형
                newComp.compId = '';
                this.onCheckBtnClick(newComp);
            }else{
                this.onCheckBtnClick(newComp);
            }
        }
    }

    // 그리드 스크롤 하단
    onGridScrollbottom(comp, info, e){
        
        if(this.isResizing){
            e.preventDefault();
            return;
        }

        if(!(this.existNext(this.rows, this.pageNo, this.totalCnt))){
            e.preventDefault();
            AToast.show("다음 페이지가 없습니다.");
            return;
        }else{
            this.onNextBtnClick();
        }
        
    }

    // 날짜 초기화 버튼
	onDateResetClick(comp, info, e)
	{
        
        this.basDt.setDate(this.getCurrentDate());

	}

    // 관심그룹 추가 버튼
	onAddGroupBtnClick(comp, info, e)
	{
        const dialog = new ADialog("add");
        dialog.setOption({
            isCenter: true,
            modalBgOption: 'light',
            isTitleBar: false,
        })
        dialog.init();
        dialog.open('Source/dialog/SetGroupName.lay', null, 200,200);
		dialog.setResultCallback((name)=> {
            if(!name) return;
            this.addGroup(name);
        });
	}

    // 전달받은 이름으로 아코디언에 group 추가하기
    addGroup(name){
        
        this.addItemsToLocal('groupList',name, 'add');
        this.getGroupList('groupList');
    }

    // 관심그룹 리스트가져오기
    async getGroupList(key) {
        const list = this.getItemFromLocal(key);
        this.accordion.removeAllItems();

        // 
        for (const item of list) {
            await this.accordion.insertItem(item, 'Source/Items/Item.lay', null, null, false, true);
        }

        setTimeout(() => {
            this.setBtnIcon();
            this.setGroupItem();
        }, 0);
    }

    // 그룹 기본값 설정
    setDefaultGroup(){
        const groupList = this.getItemFromLocal('groupList');

        // groupList가 없거나 빈 배열이라면, 기본값 추가
        if (!groupList || groupList.length === 0) {
            const defaultGroup = '관심종목 001';

            // 기본값이 이미 있는지 확인하고 없으면 추가
            if (!groupList.includes(defaultGroup)) {
                groupList.push(defaultGroup);
                this.addItemsToLocal('groupList', defaultGroup, 'add');  // 로컬스토리지에 저장
            }
        }
    }


    // 현 날짜 구하기
    getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1; // 월은 0부터 시작하므로 +1
        let date = today.getDate();

        // 월과 날짜를 두 자릿수 형식으로 변환 (01, 02, ..., 09 등)
        month = month.toString().padStart(2, '0');
        date = date.toString().padStart(2, '0');

        // 영업일 확인 함수 (주말을 제외)
        function isBusinessDay(date) {
            const day = date.getDay();
            return !(day === 0 || day === 6); // 주말(토요일(6)과 일요일(0))이면 영업일이 아님
        }

        // 이전 영업일을 구하는 함수
        function getPreviousBusinessDay(date) {
            const prevDate = new Date(date);
            
            // 영업일이 아닌 경우 하루씩 빼면서 영업일을 찾음
            do {
                prevDate.setDate(prevDate.getDate() - 1);
            } while (!isBusinessDay(prevDate));
            
            return prevDate;
        }

        // 오늘을 기준으로 가장 최신 영업일을 구하기
        const previousBusinessDay = getPreviousBusinessDay(today);

        // 연도, 월, 일 값이 바뀔 수 있도록 반환
        let resultMonth = (previousBusinessDay.getMonth() + 1).toString().padStart(2, '0');
        let resultDay = previousBusinessDay.getDate().toString().padStart(2, '0');

        return {
            year: previousBusinessDay.getFullYear(),
            month: resultMonth,
            day: resultDay
        };
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
    
    //  버튼 생성
    setBtnIcon() {
        const thisObj = this;
        $(document).ready(function() {
            const menus = $('.AAccordion-Menu');  // jQuery로 메뉴 요소 선택
            
            menus.each(function() {
                const $menu = $(this);
                const $content = $(this).siblings('.AAccordion-Contents');
                const $itemView = $content.find('.itemView');

                $menu.on('dragover', function(e){
                    e.preventDefault();
                })
                $menu.on('drop', function(e){
                    e.preventDefault();
                    const index = e.originalEvent.dataTransfer.getData('text/html'); // 종목의 인덱스값
                    const menuText = e.originalEvent.dataTransfer.getData('text/plain'); // 기존에 있던 그룹이름
                    const moveGroupName = $menu[0].textContent; // 이동할 그룹이름
                    const data = e.originalEvent.dataTransfer.getData('application/json'); // 종목 데이터 (그리드 or 타 그룹)

                    // 현재 그룹 내 이동이면 return
                    if(moveGroupName == menuText){
                        return;
                    }
                     
                    // 데이터가 없으면 리턴
                    if(!data){
                        return;
                    }

                    if(!data){
                        return;
                    }

                    thisObj.removeItems(menuText, [index]); // 기존 그룹 관심종목 삭제
                    const selectData = JSON.parse(data);
                    
                    const groupName = e.currentTarget.innerText;
                    // 드래그앤 드롭으로 관심종목 추가하기
                    const list = thisObj.getItemFromLocal(groupName);
                    const exist = list.find(item => item.code === selectData.code);

                    if(!exist){
                        thisObj.addItemsToLocal(groupName, selectData, 'add');
                        thisObj.setGroupItem(); // 관심목록에 추가
                    }else{
                        AToast.show("이미 관심그룹 내 동일종목이 있습니다.");
                        return;
                    }
                })

                $itemView.on('dragover', function(e){
                    e.preventDefault();
                })
                $itemView.on('drop', function(e){
                    e.preventDefault();

                    const index = e.originalEvent.dataTransfer.getData('text/html'); // 종목의 인덱스값
                    const menuText = e.originalEvent.dataTransfer.getData('text/plain'); // 기존에 있던 그룹이름
                    const moveGroupName = $menu[0].textContent; // 이동할 그룹이름
                    const data = e.originalEvent.dataTransfer.getData('application/json'); // 종목 데이터 (그리드 or 타 그룹)
                    
                    // 현재 그룹 내 이동이면 return
                    if(moveGroupName == menuText){
                        return;
                    }
                     
                    // 데이터가 없으면 리턴
                    if(!data){
                        return;
                    }

                    thisObj.removeItems(menuText, [index]); // 기존 그룹 관심종목 삭제
                    const selectData = JSON.parse(data);

                    const groupName = $menu[0].innerText;
                    // 드래그앤 드롭으로 관심종목 추가하기
                    const list = thisObj.getItemFromLocal(groupName);
                    const exist = list.find(item => item.code === selectData.code);

                    if(!exist){
                        thisObj.addItemsToLocal(groupName, selectData, 'add');
                        thisObj.setGroupItem(); // 관심목록에 추가
                    }else{
                        AToast.show("이미 관심그룹 내 동일종목이 있습니다.");
                        return;
                    }

                })


                // 해당 menu에 버튼이 이미 있는지 확인
                if (!$menu.find('button').length && !$menu.find('input[type="checkbox"]').length) {
                    
                    // 체크박스 생성
                    const checkBox = $('<input type="checkbox" class="menuCheckbox">');  // 체크박스 생성
                    checkBox.on('click', function(e) {
                        e.stopPropagation();
                    });
                    $menu.append(checkBox); // 현재 메뉴에 체크박스 추가

                    const nameBtn = $('<button class="nameBtn btn"></button>');  // 이름 수정 버튼 생성
                    nameBtn.on('click', function(e) {
                        e.stopPropagation(); // expand 막기
                        thisObj.nameBtnClick(e);
                    });
                    $menu.append(nameBtn);  // 현재 메뉴에 버튼 추가

                    const removeBtn = $('<button class="removeBtn btn"></button>'); // 삭제 버튼

                    removeBtn.on('click', function(e) {
                        e.stopPropagation();
                        thisObj.removeBtnClick(e);
                    });
                    $menu.append(removeBtn); // 메뉴에 삭제 버튼 추가
                }
            });
        });
    }


    // 이름변경 버튼 클릭
    nameBtnClick(e){
        
        const dialog = new ADialog("modify");
        dialog.setOption({
            isCenter: true,
            modalBgOption: 'light',
            isTitleBar: false,
        })
        
        dialog.setData(e.target.parentNode.firstChild);
        dialog.open('Source/dialog/SetGroupName.lay', null, 200,200);
        dialog.setResultCallback((name)=> {
            if(!name) return;
            
            this.changeName(e.target.parentNode, name);
        });
    }
    
    // 이름 수정 로직
    changeName(e, name){
        const menus = document.querySelectorAll('.AAccordion-Menu');
        let idx;
        for (let i=0; i<menus.length; i++){
            if (menus[i] === e) {
                idx = i;
            }
        }
        
        // 이름 바껴도 관심종목 그대로 있도록
        const originName = this.getItemFromLocal('groupList')[idx];
        const itemList = this.getItemFromLocal(originName);
        
        itemList.forEach(item => {
            this.addItemsToLocal(name, item, 'add'); 
        })
        localStorage.removeItem(originName);

        this.addItemsToLocal('groupList', name, 'modify', idx); // 로컬스토리지 수정
        this.accordion.removeAllItems(); // 아이템 초기화
        this.getGroupList('groupList'); // 재로드
    }

    // 관심그룹 삭제 처리 로직
    removeGroup(index){
        const thisObj = this;

        const groupList = this.getItemFromLocal('groupList');
        
        if(groupList.length <= index.length){
            AToast.show("관심그룹은 최소 1개이상 존재해야합니다.");
            return;
        }
        index.sort((a,b) => b - a);

        // 여러 개의 인덱스를 받으면 각각 처리
        index.forEach((idx) => {
            // 로컬스토리지 수정
            localStorage.removeItem(groupList[idx]);
            thisObj.addItemsToLocal('groupList', null, 'remove', idx);
        });

        // 아이템 초기화 및 재로드
        thisObj.accordion.removeAllItems(); // 아이템 초기화
        thisObj.getGroupList('groupList');   // 재로드
    }

    // 삭제버튼 클릭
    removeBtnClick(e){
        const thisObj = this;
        
        this.showMessageBox('정말 삭제하시겠습니까?', function(){ // 콜백
            
            const menus = document.querySelectorAll('.AAccordion-Menu');
            let idx;
            for (let i = 0; i < menus.length; i++) {
                if (menus[i] === e.target.parentNode) {
                    idx = i;
                }
            }
            thisObj.removeGroup([idx]);  // 삭제 처리
        });
    }

    // 전체선택 및 전체해제
	chkBoxBtn(comp, info, e)
	{   
        const chkBoxes = document.querySelectorAll('.menuCheckbox');
        if(comp.getText() == '전체선택'){
            chkBoxes.forEach(chkBox => {
                chkBox.checked = true;
            })
            comp.setText("전체해제");
        }else{
            chkBoxes.forEach(chkBox => {
                chkBox.checked = false;
            })
            comp.setText("전체선택");
        }
	}

    // 선택삭제
	onChkRemoveBtnClick(comp, info, e)
	{
        const thisObj = this;
        let checkedBoxIndexes  = [];
        const menus = document.querySelectorAll('.AAccordion-Menu');
        const chkBoxes = document.querySelectorAll('.menuCheckbox:checked');
        
        if(chkBoxes.length === 0){
            AToast.show("선택 항목이 없습니다.");
            return;
        }

        menus.forEach((menu, index) => {
            const chkBox = menu.querySelector('.menuCheckbox');  // 각 메뉴 내의 체크박스 선택
            if (chkBox && chkBox.checked) {  
                checkedBoxIndexes.push(index);  // 해당 메뉴의 인덱스를 배열에 추가
            }
        });

        // 삭제처리
        this.showMessageBox('정말 삭제하시겠습니까?', function(){
            
            thisObj.removeGroup(checkedBoxIndexes);
        })
        

	}

    // 공통 메시지 박스 함수
    showMessageBox(message, callback) {
        const msgBox = new AMessageBox();

        // _makeTitle 수정 (이전과 동일하게 minBtn, maxBtn 숨기기)
        AMessageBox.prototype._makeTitle = async function() {
            await AFrameWnd.prototype._makeTitle.call(this);
            // maxBtn과 minBtn 둘 다 숨기기
            if (this.maxBtn) {
                this.maxBtn.hide();  
            }
            if (this.minBtn) {
                this.minBtn.hide();  
            } 
        };

        // 메시지 박스 열기
        msgBox.openBox(null, message, AMessageBox.OK_CANCEL, function(result) {
            // 결과가 확인(0)일 때, 콜백 호출
            if (result === 0) {
                callback();  // 콜백 함수 실행
            }
        });
    }

    // 관심종목 추가
	onAddStockClick(comp, info, e)
	{   
        const thisObj = this;
        const selectData = thisObj.selectData;
        if(selectData.length === 0){
            AToast.show("종목을 선택해주세요.");
            return;
        }

        const dialog = new ADialog("select group");
        dialog.setOption({
            isCenter: true,
            modalBgOption: 'light',
            isTitleBar: false,
        })
        dialog.init();
        dialog.open('Source/dialog/SelectGroup.lay', null, 200,200);
		dialog.setResultCallback((value)=> { // 선택한 그룹 이름
            const list = thisObj.getItemFromLocal(value);
            let toastShown = false;  // 토스트 메시지가 한 번만 띄워지도록 체크하는 변수

            selectData.forEach(item => {
                const exist = list.find(groupItem => groupItem.code === item.code);
                
                if (!exist) {
                    thisObj.addItemsToLocal(value, item, 'add');
                    thisObj.setGroupItem(); // 관심목록에 추가
                } else {
                    toastShown = true;  
                }
            });

            if(toastShown){
                AToast.show("이미 관심그룹 내 동일종목이 있습니다.");
                toastShown = false;
            }
        })
	}

    // 그리드 체크박스 체크 selectData 주입/삭제
    gridRowCheck(){
        const thisObj = this;
        const checkboxes = document.querySelectorAll('.gridCheckBox');
        checkboxes.forEach(checkBox => {
            checkBox.addEventListener('click', function(){
                const row = this.parentNode.parentNode.childNodes;
                
                const selectData = {
                    market : row[4].innerText,
                    name : row[5].innerText,
                    code : row[2].innerText,
                }
                
                if(this.checked){
                    const isAlreadySelected = thisObj.selectData.some(item => item.code === selectData.code);
                    if (!isAlreadySelected) {
                        thisObj.selectData.push(selectData);
                    }
                }else{
                    thisObj.selectData = thisObj.selectData.filter(item => item.code !== selectData.code);
                }
            })
        })

    }

    // 그리드 종목 선택
	onGridSelect(comp, info, e)
	{
        const isHead = this.grid.isHeadCell(info);
        if(isHead) return;

        const checkbox = info[0].childNodes[0].childNodes[0];  // 체크박스
        const isChecked = checkbox.checked;
        checkbox.checked = !isChecked;  // 체크박스 상태 반전


        const selectData = {
            market : info[0].childNodes[4].innerText,
            name : info[0].childNodes[5].innerText,
            code : info[0].childNodes[2].innerText,
        }

        if (checkbox.checked) {
            // 체크된 상태라면 selectData에 추가
            this.selectData.push(selectData);
        } else {    
            // 체크 해제된 상태라면 selectData에서 삭제
            this.selectData = this.selectData.filter(item => item.code !== selectData.code);
        }
        
        console.log(this.selectData);

	}

    // 관심종목 그룹에 추가 (카드 생성) // 전체 선택/해제 이벤트 & 선택항목 삭제 이벤트 부여
    setGroupItem(){
        const thisObj = this;
        
        $(document).ready(function() {
            $('.AAccordion-Menu').each(function() {
                const $menu = $(this);
                const menuText = $(this).contents()[0].nodeValue; // 아코디언 그룹 이름
                
                const list = thisObj.getItemFromLocal(menuText);
                
                const contents = $(this).siblings('.AAccordion-Contents');
                const itemView = contents.find('.itemView');
                
                itemView.empty();

                // $menu.removeClass('expand');
                // contents.css('display', 'none');                

                const btnWrap = $('<div></div>').addClass('btnWrap');
                const itemSelectBtn = $('<button></button>').addClass('itemSelectBtn btn').text("전체선택");
                const itemRemoveBtn = $('<button></button>').addClass('itemRemoveBtn btn').text("삭제");
                if(list.length > 0){
                    btnWrap.append(itemSelectBtn, itemRemoveBtn);
                    itemView.append(btnWrap);
                }
                
                const selectBtn = itemView.find('.itemSelectBtn'); // 전체 선택 버튼
                const removeBtn = itemView.find('.itemRemoveBtn'); // 삭제버튼

                $(selectBtn).off('click').on('click', function(){ // 체크박스 전체 선택/해제 이벤트
                    
                    const chkBoxes = itemView.find('.card_chkBox');
                    
                    if(selectBtn.text() === '전체선택'){
                        chkBoxes.each(function() {
                            $(this).prop('checked', true);
                        })
                        selectBtn.text("전체해제");
                    }else{
                        chkBoxes.each(function() {
                            $(this).prop('checked', false);
                        })
                        selectBtn.text("전체선택");
                    }  
                });

                $(removeBtn).off('click').on('click', function(){
                    thisObj.removeItemClick(menuText, itemView);
                });

               

                // 로컬 저장 아이템 개수만큼 카드 생성함
                list.forEach((item, index) => {
                
                    const newCard = $('<div></div>').addClass('card');  // 'card' 클래스 추가
                    
                    const checkBox = $('<input type="checkbox"></input>').addClass('card_chkBox');
                    const market = $('<label></label>').addClass('card_label').text(item.market);
                    const name = $('<label></label>').addClass('card_label name').text(item.name);
                    const code = $('<label></label>').addClass('card_label code').text(item.code);
                    
                    if(item.market === 'KOSDAQ'){
                        $(market).css('color', 'green');
                    }else if(item.market === 'KONEX') {
                        $(market).css('color', 'blue');
                    }else{
                        $(market).css('color', 'red');
                    }

                    $(checkBox).on('click', function(e){
                        e.stopPropagation();
                    })

                    newCard.append(checkBox, market, name, code);
                    
                    const data = {
                        name : item.name,
                        code : item.code,
                    }
                    
                    // 카드 -> 그리드로 드래그&드롭 관심종목 삭제
                    $(newCard).prop('draggable', true);
                    $(newCard).on('dragstart', function(e){
                        e.originalEvent.dataTransfer.setData('text/html', index);
                        e.originalEvent.dataTransfer.setData('text/plain', menuText);
                        const cardData = {
                            market : e.currentTarget.childNodes[1].textContent,
                            name : e.currentTarget.childNodes[2].textContent,
                            code : e.currentTarget.childNodes[3].textContent,
                        }
                        e.originalEvent.dataTransfer.setData('application/json', JSON.stringify(cardData));
                    })

                    $(newCard).on('click', function(){ // 카드 클릭시 해당 종목 시세정보 오픈
                        thisObj.openStockPrice(data);
                    })

                    // itemView에 생성한 카드 추가

                    itemView.append(newCard); // itemView에 카드 추가  
                })
                
            })
        })
    }

    // 관심종목 삭제 버튼 
    removeItemClick(menuText, itemView){ // itemView = 클릭한 버튼이 있는 itemView
        const thisObj = this;
        let checkedBoxIdx = []; // 삭제요청할 아이템 인덱스 배열
        const $cards = itemView.find('.card'); // itemView 내 card들
        const $chkBoxes = $cards.find('.card_chkBox');
        
        $chkBoxes.each(function(index){
            const $chkBox = $(this);
            if($chkBox.prop('checked')){
                checkedBoxIdx.push(index);
            }
        })
        
        if(checkedBoxIdx.length === 0){
            AToast.show("선택 항목이 없습니다.");
            return;
        }

        // 삭제처리
        this.showMessageBox('정말 삭제하시겠습니까?', function(){
            
            // 관심종목 삭제 처리 로직
            thisObj.removeItems(menuText, checkedBoxIdx);
        })
    }

    // 관심종목 삭제처리 로직
    removeItems(key, idx){
        const thisObj = this;
        
        idx.sort((a,b) => b - a); // 인덱스 정렬 ( 큰번호 부터 지우도록 )
        idx.forEach((i) => {
            thisObj.addItemsToLocal(key, null, 'remove', i);
        })

        thisObj.accordion.removeAllItems(); // 아이템 초기화
        thisObj.getGroupList('groupList');   // 재로드
    }

    // 관심종목 클릭시 시세정보 오픈
    openStockPrice(data){
        const wnd = new AWindow("info");
        wnd.setOption({
            isCenter : true,            
            modalBgOption : 'light',
            overflow : 'auto',
            isDraggable: false,
            isFocusLostClose: true, 
        })
        const code = (data.code).substring(1);

        const result = {
            name : data.name,
            code : code,
        }
        
        wnd.setData(result);
        wnd.openAsMenu('Source/Window/InfoWindowView.lay', null, 1200, 700);
    }

    // 햄버거 메뉴
	onMenuIconClick(comp, info, e)
	{   
		comp.element.classList.toggle('active');
        this.menu_div.element.classList.toggle('div_active');
	}
}

