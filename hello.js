var request=require('request');
request('http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=%EC%84%9C%EC%B4%88%EA%B5%AC&dataTerm=daily&pageNo=1&numOfRows=1&ServiceKey=IRw86Lln5mLdFBdurIth3h45Kk3ubLoozSjOupqmmHlqfN8Ozk3ztxyL2lTxHZfMiikCtHrooV0K56UyBW3JBw%3D%3D&ver=1.3',function(error, response, body){
if(!error&&response.statusCode==200)
  console.log(body);
});
