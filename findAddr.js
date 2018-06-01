var station_name ='세종';
var urlencode = require('urlencode');
var encoded_stname  = urlencode(station_name);

var $url = 'http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getMsrstnList?'
const $KEY = 'IRw86Lln5mLdFBdurIth3h45Kk3ubLoozSjOupqmmHlqfN8Ozk3ztxyL2lTxHZfMiikCtHrooV0K56UyBW3JBw%3D%3D&ver=1.3';
const $addr = encoded_stname;
var $api_url = $url + 'addr=' + $addr + '&pageNo=1&numOfRows=100&ServiceKey='+$KEY;
console.log($api_url);

var addrStr='';

let request = require('request');
let cheerio = require('cheerio');

request($api_url,function(error,response,body){
    $ = cheerio.load(body);
    var cnt=0;

    $('item').each(function(idx) {
        let stationN = $(this).find('stationName').text();
        cnt++;
        addrStr=addrStr+' '+stationN;
        console.log(cnt, stationN);

    });

    console.log(addrStr);
});
