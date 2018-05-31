var station_name ='강남구';
var urlencode = require('urlencode');
var encoded_stname  = urlencode(station_name);
//console.log(encoded_stname);



const $url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?';
const $KEY = 'IRw86Lln5mLdFBdurIth3h45Kk3ubLoozSjOupqmmHlqfN8Ozk3ztxyL2lTxHZfMiikCtHrooV0K56UyBW3JBw%3D%3D&ver=1.3';
const $station = encoded_stname;
var $api_url = $url + 'ServiceKey=' + $KEY + '&stationName=' + $station +'&dataTerm=daily&pageNo=1&numOfRows=1&ver=1.3'

var statePm10='';
var statePm25='';
var url_api_ans;
let request=require('request');
let cheerio = require('cheerio');

request($api_url,function(error,response,body){
    $ = cheerio.load(body);
    $('item').each(function(idx) {
        let pm10 = $(this).find('pm10Value').text();
        let dataTime = $(this).find('dataTime').text();
        let pm25 = $(this).find('pm25Value').text();

        if(pm10<=30) statePm10='좋음';
        else if(30<pm10 && pm10<=80) statePm10='보통';
        else if(80<pm10 && pm10<=150) statePm10='나쁨';
        else if(150<pm10) statePm10='매우 나쁨';

        if(pm25<=15) statePm25='좋음';
        else if(15<pm25 && pm25<=35) statePm25='보통';
        else if(35<pm25 && pm25<=75) statePm25='나쁨';
        else if(75<pm25) statePm25='매우 나쁨';

        console.log('측정소:', station_name);
        console.log('측정일:', dataTime);
        console.log('미세먼지:', pm10, '상태:', statePm10);
        console.log('초미세먼지:', pm25, '상태:', statePm25);
    });
});
