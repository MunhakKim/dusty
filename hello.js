var urlencode = require('urlencode');
var stationNameTest = urlencode('종로구');

console.log(stationNameTest);

var request=require('request');
var urlTest='http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName='+stationNameTest+'&dataTerm=daily&pageNo=1&numOfRows=1&ServiceKey=IRw86Lln5mLdFBdurIth3h45Kk3ubLoozSjOupqmmHlqfN8Ozk3ztxyL2lTxHZfMiikCtHrooV0K56UyBW3JBw%3D%3D&ver=1.3';

console.log(urlTest);

request(urlTest,function(error, response, body){
if(!error&&response.statusCode==200)
  console.log(body);
});
