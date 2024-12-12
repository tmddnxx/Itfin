
/**
Constructor
Do not call Function in Constructor.
*/
class naverProjectLsw()
{
	super();
	

}
extends AView;


function naverProjectLsw*init(context, evtListener)
{
	super.init(context, evtListener);

	this.listData = 
	[
		{title : '[속보]"거대야당, 북한 편 들면서 정부 흠집내기만 해"'},
		{title : '[속보]윤 "국방장관에 선관위 전산시스템 점검 지시"'},
		{title : '[속보]"한동훈 "탄핵안, 의원들 소신 따라 표결 참여해야'},
		{title : '홍준표"尹이 대통령인데 내란죄? 민주당 선동"'},
		{title : '황교안 "조국, 오늘 교도소 갈 것" 확신 이유는'},
		{title : '고령층,PK,TK에 "尹 즉각 퇴진해야?" 묻자 대답이...'},
	];

};

function naverProjectLsw*onInitDone()
{
	super.onInitDone();
	
	this.c_shop_main.addTab('쇼핑', 'Source/SubView/shopTabView/tabViewShopping.lay', 'tabViewShop'); // 탭 아이디 추가
	this.c_shop_main.addTab('맨즈', 'Source/SubView/shopTabView/tabViewMans.lay', 'tabViewMans'); // 탭 아이디 추가
	this.c_shop_main.addTab('원쁠딜', 'Source/SubView/shopTabView/tabViewOne.lay', 'tabViewOne'); // 탭 아이디 추가
	this.c_shop_main.addTab('쇼핑라이브', 'Source/SubView/shopTabView/tabViewLive.lay', 'tabViewLive'); // 탭 아이디 추가
	
	this.c_shop_main.selectTabById('tabViewShop'); // 첫 탭화면 설정
	this.search_input.setFocus(); // 검색창 포커스설정
	
	animateText(); // 상하 애니메이션 
	timeSet(); // 오늘 날짜 설정
	horizonSlide(); // 좌우 애니메이션
	slidePaging(); // 좌우 슬라이딩 페이징
	scroll();
	
	
};

function naverProjectLsw*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);
	
	//TODO:edit here

};

// 탭뷰 클릭 이벤트
function naverProjectLsw*clickTabBtn(label){
	const tabName = label.compId;
	const labels = document.querySelectorAll('.tabBtn');
	
	// 라벨 클래스 변경
	labels.forEach(label => {
		label.classList.remove('onClick');
	});
	
	label.$ele[0].classList.add('onClick');
	
	// 탭 화면 변경
	if(tabName === 'c_shop_btn'){
		this.c_shop_main.selectTabById('tabViewShop');
		
	}else if(tabName === 'c_mans_btn'){
		this.c_shop_main.selectTabById('tabViewMans');
	}else if(tabName === 'c_one_btn'){
		this.c_shop_main.selectTabById('tabViewOne');
	}else if(tabName === 'c_live_btn'){
		this.c_shop_main.selectTabById('tabViewLive');
	}
	
};

// 숏컷 리스트 더보기 버튼 클릭 이벤트
function naverProjectLsw*onMoreBtnClick(comp, info, e)
{	
	const area = this.shortcut_area.element;
	const group = this.shortcut_group.element;

	// 더보기 버튼 토글 
	area.classList.toggle('is_expanded');
	// 열렸을때 버튼 확장 및 텍스트 수정 
	if(area.classList.contains('is_expanded')){
		group.style.display = 'block';
		comp.setText("X");
	}else{
	// 원상복구
		group.style.display = 'none';
		comp.setText("ㆍㆍㆍ");
	}

};

// 상하 슬라이드 애니메이션
function animateText() {
  const texts = document.querySelectorAll('.slide_text');
      let currentIndex = 0;

      // 첫 번째 텍스트에 'visible' 클래스를 추가하여 페이지 로드 시 바로 보이도록 함
      texts[currentIndex].classList.add('visible');

      setInterval(() => {
        // 현재 텍스트에서 'visible' 클래스를 제거하고 'hidden' 클래스를 추가
		
        texts[currentIndex].classList.remove('visible');
        texts[currentIndex].classList.add('hidden');

        // 'currentIndex'를 증가시키며, 마지막 텍스트 이후 첫 번째 텍스트로 돌아오도록 함
        currentIndex = (currentIndex + 1) % texts.length;

	 // 마지막 텍스트에서 첫 번째 텍스트로 돌아갈 때, 모든 텍스트에 대해 'hidden' 클래스를 초기화
        if (currentIndex === texts.length-1) {
			texts.forEach((text, index) => {
				if (index !== texts.length - 1) {  // 마지막 인덱스 제외
					text.classList.remove('hidden');
				}
			});
        }

        // 모든 텍스트에서 'hidden' 클래스를 삭제하고, 5번째 텍스트도 'hidden' 클래스를 삭제하여 다시 처음부터 시작
        if (currentIndex === 0) {
          texts[texts.length-1].classList.remove('hidden');
        }	
		
        // 다음 텍스트에 'visible' 클래스를 추가하여 보이게 함
        texts[currentIndex].classList.remove('hidden');
        texts[currentIndex].classList.add('visible');
		
      }, 5000); // 5초마다 애니메이션 반복
    
}

// 뉴스 그리드 hover change
function naverProjectLsw*onNewsBtnActionenter(comp, info, e)
{

	comp.element.classList.add('newsOver');
	comp.setHtml(`<div>
					<label class="labelOver">구독</label> |
					<label class="labelOver">기사보기</label>
				</div>`);

};
// 뉴스 그리드 hover default
function naverProjectLsw*onNewsBtnActionleave(comp, info, e)
{
	
	comp.setImage('Assets/naver/news_logo.png');
	comp.setIconSize('100px 30px');
	comp.setText("");
};


// 뉴스 리스트뷰 보기
function naverProjectLsw*onNewsListBtnClick(comp, info, e)
{

	const gridBtn = this.newsGridBtn.element;
	comp.element.classList.add('btnClick');
	gridBtn.classList.remove('btnClick');
	
	this.c_news_main.loadView('Source/SubView/news/newsListView.lay'); // SubView Load
	this.listView.addItem('Source/SubView/news/listItems/itemView.lay', this.listData); // 리스트 뷰 아이템 추가
};

// 뉴스 그리드뷰 보기
function naverProjectLsw*onNewsGridBtnClick(comp, info, e)
{

	const listBtn = this.newsListBtn.element;
	comp.element.classList.add('btnClick');
	listBtn.classList.remove('btnClick');
	this.c_news_main.loadView('Source/SubView/news/newsGridView.lay');

};

// 리스트 좌측 탭버튼 
function naverProjectLsw*newsListTabClick(comp){
	const listTabs = document.querySelectorAll('.newsListDefault');
	
	for(let i=0; i<listTabs.length; i++){
		if(comp.element === listTabs[i]){
			comp.element.classList.add('newsListClick');
			
		}else{
			listTabs[i].classList.remove('newsListClick');
			
		}
	}
};

// 날짜 Reload 버튼 클릭 이벤트
function naverProjectLsw*onTimeReloadBtnClick(comp, info, e)
{
	timeSet();
};

function timeSet(){
	
	// 변경할 라벨
	const timeText = document.getElementById('_1--timeText');
	
	// 오늘 날짜
	const today = new Date();
	
	const month = today.getMonth()+1;
	
	const date = today.getDate();
	const hour = today.getHours();
	const minutes = today.getMinutes();
	// 형식 포맷
	const format = month+"."+date+". "+hour+":"+minutes;
	
	timeText.innerText = format;
}

// 좌우 슬라이드
function horizonSlide(){
	const items = document.querySelectorAll('.h_slide_item'); 
	const start = items[0];
	const end = items[items.length - 1];

	// 엘리먼트 생성하기
	const startElem = document.createElement(start.tagName);
	const endElem = document.createElement(end.tagName);
	// 엘리먼트 속성 복사
	end.classList.forEach((c) => endElem.classList.add(c));
	endElem.innerHTML = end.innerHTML;
	start.classList.forEach((c) => startElem.classList.add(c));
	startElem.innerHTML = start.innerHTML;

	// 복사한 엘리먼트 양쪽 끝에 위치
	items[0].before(endElem);
	items[items.length - 1].after(startElem);

	const container = document.getElementById('_1--slide_item_container');
	
	let i = 0;
	let isTransitioning = false;
	
	
	setInterval(() => {
	  if (isTransitioning) return; // 트랜지션이 진행 중이면 작업하지 않음
	  
	  i++;
	  isTransitioning = true;
	  container.style.transition = 'transform 0.5s ease';
	  container.style.transform = `translateX(-${400 * i}px)`; // 슬라이드 이동

	  // 마지막 아이템에서 첫 번째 아이템으로 돌아갈 때 처리
	  if (i === 4) {
		setTimeout(() => {
		
		  container.style.transition = 'none'; // 트랜지션을 끄고, 바로 첫 번째 아이템으로 이동
		  i = 1;
		  container.style.transform = `translateX(-400px)`;
		  isTransitioning = false;
		}, 500); // 트랜지션 끝나고 0.5초 뒤에 동작
	  } else {
		isTransitioning = false;
	  }
	  
	}, 2000);

}

// 슬라이드 페이징 버튼
function slidePaging(){
	const pages = document.querySelectorAll('.horizonSlidePage');
	
	pages[0].classList.add('hSlideActive');
	
	let i=0;
	
	setInterval(() => {
		pages[i].classList.remove('hSlideActive');
		i++;
		if(i > pages.length-1){
			i = 0;
		}
		pages[i].classList.add('hSlideActive');
	},2000);
}

// 스크롤
function scroll(){
	window.addEventListener('scroll', () => {
		let scrollY = window.scrollY;
		const searchBox = document.getElementById('_1--search_area');
		
		if(scrollY >= 200){
			searchBox.classList.add('fixed');
			searchBox.firstChild.classList.add('fixed-inner');
		}else{
			searchBox.classList.remove('fixed');
			searchBox.firstChild.classList.remove('fixed-inner');
		}
	});
	
}


// 하단 세팅버튼
function naverProjectLsw*onSettingBtnClick(comp, info, e)
{

	comp.element.classList.toggle('btnDown');

};

// 하단 Top 버튼
function naverProjectLsw*onTopBtnClick(comp, info, e)
{
	window.scrollTo(0,0);
	
};
