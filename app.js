
var express = require('express');
var http = require('http');

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/keyboard', function(req,res) {
    var data ={
        'type': 'buttons',
        'buttons': ['서초구','송파구','종로구']
    };
    res.json(data);
});

app.post('/message',function(req,res) {
    var msg = req.body.content;
    console.log('전달받은 메시지: ' + msg);

    var send = {};
    switch(msg) {
        case '서초구':
            send = {
                'message': {
                    'text': '서초구 미세먼지 상태는 나쁨입니다!\n 외출시 마스크를 잊지마세요'
                }
            }
            break;
        case '송파구':
            send = {
                'message': {
                    'text': '송파구 미세먼지 상태는 매우나쁨입니다!\n 가급적 외출을 삼가주세요!!'
                }
            }
            break;
        case '종로구':
            send = {
                'message': {
                    'text': '종로구 미세먼지 상태는 좋음입니다!'
                }
            }
            break;
        default:
            send = {
                'message': {
                    'text': '알 수 없는 명령입니다!'
                }
            }
            break;
    }
});
http.createServer(app).listen(9090, function() { console.log('서버 실행 중...\n')});
//var urlencode = require('urlencode'); console.log(urlencode('변환')); //console.log(urlencode.decode('%EB%B3%80%ED%99%98'));



//http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=%EC%84%9C%EC%B4%88%EA%B5%AC&dataTerm=daily&pageNo=1&numOfRows=1&ServiceKey=IRw86Lln5mLdFBdurIth3h45Kk3ubLoozSjOupqmmHlqfN8Ozk3ztxyL2lTxHZfMiikCtHrooV0K56UyBW3JBw%3D%3D&ver=1.3

var station_name ='서초구';
var urlencode = require('urlencode');
var encoded_stname  = urlencode(station_name);
console.log(encoded_stname);

const $url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?';
const $KEY = 'IRw86Lln5mLdFBdurIth3h45Kk3ubLoozSjOupqmmHlqfN8Ozk3ztxyL2lTxHZfMiikCtHrooV0K56UyBW3JBw%3D%3D&ver=1.3';
const $station = encoded_stname;
var $api_url = $url + 'ServiceKey=' + $KEY + '&stationName=' + $station +'&dataTerm=daily&pageNo=1&numOfRows=1&ver=1.3'


var url_api_ans;
let request=require('request');
let cheerio = require('cheerio');
request($api_url,function(error,response,body){
    $ = cheerio.load(body);
    $('item').each(function(idx) {
        let pm10 = $(this).find('pm10Value').text();
        let pm25 = $(this).find('pm25Value').text();
        console.log(pm10);
        console.log(pm25);
    });
});
/*request($api_url,function(error,response,body){
    if(!error&&response.statusCode==200)
  console.log(body);
});*/

