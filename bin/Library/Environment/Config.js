const config = {
    SERVICE_KEY : 'F5ujJyROcnI9iWwnC2PNJMJuaKdQuZM4ca+pNnr63OPQRkVWmm9kRFRBdfc98NrnqApyRGyLNkYhbFeM0fbjlA==',
    BASE_URL : 'https://apis.data.go.kr/1160100/service/GetKrxListedInfoService',
    REQUEST_URL : 'getItemInfo',
    INFO_BASE_URL : 'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService',
    INFO_REQUEST_URL : 'getStockPriceInfo',
    KOSPI_BASE_URL : 'https://apis.data.go.kr/1160100/service/GetMarketIndexInfoService',
    KOSPI_REQUEST_URL : 'getStockMarketIndex'
}

const apiError = {
    1: "어플리케이션 에러",
    10: "잘못된 요청 파라미터 에러",
    12: "해당 오픈 API서비스가 없거나 폐기됨",
    20: "서비스 접근거부",
    22: "서비스 요청제한횟수 초과에러",
    30: "등록되지 않은 서비스키",
    31: "기한만료된 서비스키",
    32: "등록되지 않은 IP",
    99: "기타에러",
}

// XML을 JSON으로 변환하는 함수
function parseXMLToJSON(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  // XML에서 JSON으로 변환하는 함수
  function xmlToJson(xml) {
    let obj = {};

    // element node일 경우
    if (xml.nodeType === 1) {
      // 속성이 있는 경우
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let i = 0; i < xml.attributes.length; i++) {
          const attribute = xml.attributes.item(i);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) { // text node
      obj = xml.nodeValue;
    }

    // 자식 노드가 있는 경우
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;
        if (typeof(obj[nodeName]) === "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) === "undefined") {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  }

  return xmlToJson(xmlDoc);
}