
var station_name ='서초구';
var urlencode = require('urlencode');
var encoded_stname  = urlencode(station_name);
//console.log(encoded_stname);


function classServiceId(num){
    switch(num){
        case 1:
            var ser1 = 'ArpltnInforInqireSvc/';      // 1.대기오염정보 조회 서비스
            return ser1;
            break;

        case 2:
            var ser2 = 'ArpltnStatsSvc/';            // 2.대기오염통계 서비스
            return ser2;
            break;
    }
}

function classServiceDetail(num1,num2) {
    var serviceId = classServiceId(num1);

    if(num1==1){
        switch(num2){
            case 1:
                serviceId+='getMsrstnAcctoRltmMesureDnsty?';              // 1_1. 측정소별 실시간 측정정보 조회
                break;
            case 2:
                serviceId+='getUnityAirEnvrnIdexSnstiveAboveMsrstnList?'; // 1_2. 통합대기환경지수 나쁨 이상 측정소 목록조회
                break;
            case 3:
                serviceId+='getCtprvnRltmMesureDnsty?';                   // 1_3. 시도별 실시간 측정정보 조회
                break;
            case 4:
                serviceId+='getMinuDustFrcstDspth?';                      // 1_4. 미세먼지/오존 예보통보 조회
                break;
            case 5:
                serviceId+='getCtprvnMesureLIst?';                        // 1_5. 시도별 실시간 평균정보 조회
                break;
            case 6:
                serviceId+='getCtprvnMesureSidoLIst?';                    // 1_6. 시군구별 실시간 평균정보 조회
                break;
        }
    }
    else if(num1==2)
        {
            switch(num2){
            case 1:
                serviceId+='getMsrstnAcctoLastDcsnDnsty?';               // 2_1. 측정소별 최종확정 농도 조회
                break;
            case 2:
                serviceId+='getDatePollutnStatInfo?';                    // 2_2. 기간별 오염통계 정보 조회
                break;
            }

        }

    return serviceId;

}


var $url = 'http://openapi.airkorea.or.kr/openapi/services/rest/' + classServiceDetail(1,1); // 서비스 조회목록에 맞춰 url 생성

const $KEY = 'IRw86Lln5mLdFBdurIth3h45Kk3ubLoozSjOupqmmHlqfN8Ozk3ztxyL2lTxHZfMiikCtHrooV0K56UyBW3JBw%3D%3D&ver=1.3';
const $station = encoded_stname;
var $api_url = $url + 'ServiceKey=' + $KEY + '&stationName=' + $station +'&dataTerm=daily&pageNo=1&numOfRows=1&ver=1.3'

//console.log($api_url);


var url_api_ans;
let request = require('request');
let cheerio = require('cheerio');


var statePm10='';
var statePm25='';


function statePm10Func(pm10){
    /*
    미세먼지 상태 판별 함수
    */

    var pm10Str='';

    if(pm10<=30) pm10Str='좋음';
    else if(30<pm10 && pm10<=80) pm10Str='보통';
    else if(80<pm10 && pm10<=150) pm10Str='나쁨';
    else if(150<pm10) pm10Str='매우 나쁨';

    return pm10Str;
}

function statePm25Func(pm25){
    /*
    초미세먼지 상태 판별 함수
    */

   var pm25Str='';

   if(pm25<=15) pm25Str='좋음';
    else if(15<pm25 && pm25<=35) pm25Str='보통';
    else if(35<pm25 && pm25<=75) pm25Str='나쁨';
    else if(75<pm25) pm25Str='매우 나쁨';

    return pm25Str;
}

request($api_url,function(error,response,body){
    $ = cheerio.load(body);
    $('item').each(function(idx) {

        let pm10 = $(this).find('pm10Value').text();
        let dataTime = $(this).find('dataTime').text();
        let pm25 = $(this).find('pm25Value').text();

        statePm10 = statePm10Func(pm10);
        statePm25 = statePm25Func(pm25);

        console.log('측정소:', station_name);
        console.log('측정일:', dataTime);
        console.log('미세먼지:', pm10, '상태:', statePm10);
        console.log('초미세먼지:', pm25, '상태:', statePm25);
    });
});
