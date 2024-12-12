
/**
Constructor
Do not call Function in Constructor.
*/
class naverProjectLsw()
{
	super();

	//TODO:edit here

}
extends AView;


function naverProjectLsw*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

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
	
	animateText();
	
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

// 리스트 더보기 버튼 클릭 이벤트
function naverProjectLsw*onMoreBtnClick(comp, info, e)
{	
	const area = this.shortcut_area.element;
	const group = this.shortcut_group.element;

	
	area.classList.toggle('is_expanded');
	if(area.classList.contains('is_expanded')){
		group.style.display = 'block';
		comp.setText("X");
	}else{
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
	console.log(comp);
	console.log(comp.element);	
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
	
	this.c_news_main.loadView('Source/SubView/news/newsListView.lay');

};

// 뉴스 그리드뷰 보기
function naverProjectLsw*onNewsGridBtnClick(comp, info, e)
{

	const listBtn = this.newsListBtn.element;
	comp.element.classList.add('btnClick');
	listBtn.classList.remove('btnClick');
	this.c_news_main.loadView('Source/SubView/news/newsGridView.lay');

};

// 리스트 탭버튼 
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

