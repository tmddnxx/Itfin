!async function(){await afc.import("Framework/afc/library/ADataMask.js"),ADataMask.Stock={moneyNo0:{title:"값이 0인 경우 공백문자를 반환하고 그 외에는 정수 3자리마다 콤마를 넣는다.",func:function(t,o,a){return t=t&&0!=Number(t)?ADataMask.Number.money.func(t):"　"}},cfValue:{title:"특정 필드값과 값을 비교하여 상승,하락,보합색으로 변경한다.(StockColor.UP_COLOR, DOWN_COLOR, STEADY_COLOR)",param:["비교필드명"],func:function(t,o,a){var e=ADataMask.getQueryData()[0],r=0;return(r=e&&e[o[0]]?e[o[0]]:r)<t?$(a).css("color",StockColor.UP_COLOR):t<r?$(a).css("color",StockColor.DOWN_COLOR):$(a).css("color",StockColor.STEADY_COLOR),t}},ValueCfZero:{title:"특정 필드값과 0을 비교하여 상승,하락,보합색으로 변경한다.(StockColor.UP_COLOR, DOWN_COLOR, STEADY_COLOR)",param:["비교필드명"],func:function(t,o,a){var e=ADataMask.getQueryData()[0],r=0;return 0<(r=e&&e[o[0]]?e[o[0]]:r)?$(a).css("color",StockColor.UP_COLOR):r<0?$(a).css("color",StockColor.DOWN_COLOR):$(a).css("color",StockColor.STEADY_COLOR),t}},ColorByState:{title:"등락구분 필드값에 따라 글자색을 상승,하락,보합색으로 변경한다.(StockColor.UP_COLOR, DOWN_COLOR, STEADY_COLOR)",param:["등락구분 필드명"],func:function(t,o,a){var e=ADataMask.getQueryData()[0],r=3,e=(e&&e[o[0]]&&(r=e[o[0]]),stk.getStockColor(r)||StockColor.STEADY_COLOR);return e&&$(a).css("color",e),t}},cfStkRefValue:{title:"stk.setRefData 로 저장된 비교값과 값을 비교하여 상승,하락,보합색으로 변경한다.(StockColor.UP_COLOR, DOWN_COLOR, STEADY_COLOR)",param:["비교키명"],func:function(t,o,a){o=stk.getRefData(o[0]);return(o=null==o?0:o)<t?$(a).css("color",StockColor.UP_COLOR):t<o?$(a).css("color",StockColor.DOWN_COLOR):$(a).css("color",StockColor.STEADY_COLOR),t}},addBong:{title:"그리드의 셀에 봉을 표현한다. 셀의 넓이, 높이값 세팅필요(다른 컴포넌트에서는 적용되지 않음)",param:["시가 필드명","고가 필드명","저가 필드명","종가 필드명","봉 넓이(15px)","봉 높이(60px)"],func:function(t,o,a){var e,r=ADataMask.getQueryData()[0];if(!a.exbong)return(e=new EXBong).init(),e.$ele.css({position:"relative",float:"left",width:o[4]||"15px",height:o[5]||"60px"}),e.setData([r[o[0]],r[o[1]],r[o[2]],r[o[3]]]),a.exbong=e;a.exbong.setData([r[o[0]],r[o[1]],r[o[2]],r[o[3]]])}},addTriangle:{title:"그리드의 셀에 등락구분 값으로 삼각형을 표현한다. (StockColor.UP_COLOR, DOWN_COLOR, STEADY_COLOR)",param:["등락구분 필드명","넓이(16px)","높이(14px)"],func:function(t,o,a){var e=ADataMask.getQueryData()[0];if(e&&e[o[0]]&&(t=e[o[0]]),!a.extriangle)return(e=new EXTriangle).init(),e.$ele.css({position:"static",width:o[1]||"16px",height:o[2]||"14px"}),e.initPos(),e.setDirection(t),a.extriangle=e;a.extriangle.setDirection(t)}},cfValueTriangle:{title:"그리드의 셀에 특정 필드값과 값을 비교하여 삼각형을 표현한다. (StockColor.UP_COLOR, DOWN_COLOR, STEADY_COLOR)",param:["비교필드명","넓이(16px)","높이(14px)"],func:function(t,o,a){var e=ADataMask.getQueryData()[0],r=0,r=(r=e&&e[o[0]]?e[o[0]]:r)<t?2:t<r?5:3;if(t=null,!a.extriangle)return(e=new EXTriangle).init(),e.$ele.css({position:"relative",float:"left",width:o[1]||"16px",height:o[2]||"14px"}),e.initPos(),e.setDirection(r),a.extriangle=e;a.extriangle.setDirection(r)}}}}();