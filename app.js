var express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var bodyParser = require('body-parser');

var app = express();
var url_api_ans;
let request = require('request');
let cheerio = require('cheerio');


//데이터 베이스 연결 부분
var mentStr;

const mongoose = require('mongoose');
mongoose.connect('mongodb://kakao-chatbot-db:rlaansgkr1@ds018238.mlab.com:18238/kakao-chatbot-dusty');

var RanNum;

function getRandomInt(min, max) { //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
}

RanNum = getRandomInt(1, 5);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('FreshbankdDB DataBase is connected with mongoose!');
});





//멘트 저장 스키마
var mentTemp = mongoose.Schema({
    index: 'number',
    ment: 'string'
});



//멘트 저장 테이블
var Ment1 = mongoose.model('Ment1', mentTemp);

// 8. Student 객체를 new 로 생성해서 값을 입력
//var newStudent = new Student({name:'Hong Gil Dong', address:'서울시 강남구 논현동', age:'22'});



Ment1.findOne({
    'index': RanNum
}).select('ment').exec(function (err, user) {

    //console.log("q1");
    mentStr = user.ment;
    console.log(user.ment + "\n");

    return;

});



// 11. 특정 아이디값 가져오기
/*
Student.findOne({_id:'585b777f7e2315063457e4ac'}, function(error,student){
    console.log('--- Read one ---');
    if(error){
        console.log(error);
    }else{
        console.log(student);
    }
});
*/









function stationNameFunc(msg) {
    var station_name = msg;
    var urlencode = require('urlencode');
    var encoded_stname = urlencode(station_name);

    return encoded_stname;

}

var statePm10 = '';
var statePm25 = '';

function makeUrl(msg) {

    var $url = 'http://openapi.airkorea.or.kr/openapi/services/rest/' + classServiceDetail(1, 1); // 서비스 조회목록에 맞춰 url 생성

    const $KEY = 'IRw86Lln5mLdFBdurIth3h45Kk3ubLoozSjOupqmmHlqfN8Ozk3ztxyL2lTxHZfMiikCtHrooV0K56UyBW3JBw%3D%3D&ver=1.3';
    const $station = stationNameFunc(msg);
    var $api_url = $url + 'ServiceKey=' + $KEY + '&stationName=' + $station + '&dataTerm=daily&pageNo=1&numOfRows=1&ver=1.3'

    return $api_url;
}

function classServiceId(num) {
    switch (num) {
        case 1:
            var ser1 = 'ArpltnInforInqireSvc/'; // 1.대기오염정보 조회 서비스
            return ser1;
            break;

        case 2:
            var ser2 = 'ArpltnStatsSvc/'; // 2.대기오염통계 서비스
            return ser2;
            break;
    }
}

function classServiceDetail(num1, num2) {
    var serviceId = classServiceId(num1);

    if (num1 == 1) {
        switch (num2) {
            case 1:
                serviceId += 'getMsrstnAcctoRltmMesureDnsty?'; // 1_1. 측정소별 실시간 측정정보 조회
                break;
            case 2:
                serviceId += 'getUnityAirEnvrnIdexSnstiveAboveMsrstnList?'; // 1_2. 통합대기환경지수 나쁨 이상 측정소 목록조회
                break;
            case 3:
                serviceId += 'getCtprvnRltmMesureDnsty?'; // 1_3. 시도별 실시간 측정정보 조회
                break;
            case 4:
                serviceId += 'getMinuDustFrcstDspth?'; // 1_4. 미세먼지/오존 예보통보 조회
                break;
            case 5:
                serviceId += 'getCtprvnMesureLIst?'; // 1_5. 시도별 실시간 평균정보 조회
                break;
            case 6:
                serviceId += 'getCtprvnMesureSidoLIst?'; // 1_6. 시군구별 실시간 평균정보 조회
                break;
        }
    } else if (num1 == 2) {
        switch (num2) {
            case 1:
                serviceId += 'getMsrstnAcctoLastDcsnDnsty?'; // 2_1. 측정소별 최종확정 농도 조회
                break;
            case 2:
                serviceId += 'getDatePollutnStatInfo?'; // 2_2. 기간별 오염통계 정보 조회
                break;
        }

    }

    return serviceId;

}


function statePm10Func(pm10) {
    /*
    미세먼지 상태 판별 함수
    */

    var pm10Str = '';

    if (pm10 <= 30) pm10Str = '좋음';
    else if (30 < pm10 && pm10 <= 80) pm10Str = '보통';
    else if (80 < pm10 && pm10 <= 150) pm10Str = '나쁨';
    else if (150 < pm10) pm10Str = '매우 나쁨';

    return pm10Str;
}

function statePm25Func(pm25) {
    /*
    초미세먼지 상태 판별 함수
    */

    var pm25Str = '';

    if (pm25 <= 15) pm25Str = '좋음';
    else if (15 < pm25 && pm25 <= 35) pm25Str = '보통';
    else if (35 < pm25 && pm25 <= 75) pm25Str = '나쁨';
    else if (75 < pm25) pm25Str = '매우 나쁨';

    return pm25Str;
}

//express()
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.get('/', (req, res) => res.send("kakao chatbot dust test"))
app.get('/cool', (req, res) => res.send("hello world!"))
app.get('/keyboard', function (req, res) {
    var data = {
        'type': 'buttons',
        'buttons': ['설명', '서울', '경기', '인천', '대구', '광주', '대전', '울산', '경북', '경남', '충북', '충남', '전북', '전남', '제주', '강원', '세종']
    };
    res.json(data);
    //console.log(res);
});
//app.post('/keyboard', function (req, res) {
//
//    var msg = req.body.content;
//    console.log(msg);
//
//    var data = {
//        'type': 'buttons',
//        'buttons': [
//                    '선택 1',
//                    '선택 2',
//                    '선택 3'
//                ]
//    };
//    res.json(data);
//
//
//
//});
app.post('/message', function (req, res) {
    var msg = req.body.content;
    var userId = req.body.user_key;
    console.log('전달받은 메시지: ' + msg);
    console.log('유저식별키: ' + userId);
    var send = {};

    switch (msg) {
        case '설명':
            send = {
                'message': {
                    'text': '다시 띄워봅니다'
                },
                'keyboard': {
                    'type': 'buttons',
                    'buttons': [
                    '선택 1',
                    '선택 2',
                    '선택 3'
                    ]
                }
            }
            res.json(send);
            break;
        case '서울':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '중구  한강대로  종로구  청계천로  종로  용산구  광진구  성동구  강변북로  중랑구  동대문구  홍릉로  성북구  정릉로  도봉구  은평구  서대문구  마포구  신촌로  강서구  공항대로  구로구  영등포구  영등포로  동작구  동작대로 중앙차로  관악구  강남구  서초구  도산대로  강남대로  송파구  강동구  천호대로  금천구  강북구  양천구  노원구  화랑로'
                }
            }
            res.json(send);
            break;

        case '경기':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '신풍동  인계동  광교동  영통동  천천동  경수대로(동수원)  고색동  대왕판교로(백현동)  단대동  정자동  수내동  성남대로(모란역)  복정동  운중동  상대원동  의정부동  의정부1동  안양6동  부림동  호계동  안양2동  철산동  소하동  고잔동  원시동  본오동  원곡동  부곡동1  대부동  호수동  중앙대로(고잔동)  별양동  과천동  교문동  동구동  부곡3동  고천동  정왕동  시화산단  대야동  금곡동  오남읍  비전동  안중  평택항  금촌동  행신동  식사동  백마로(마두역)  경안동  김량장동  수지  기흥  중부대로(구갈동)  설성면  창전동  관인면  선단동  사우동  고촌읍  통진읍  당동  산본동  오산동  신장동  남양읍  향남  동탄  백석읍  보산동  봉산동  여주  연천읍  가평  양평  부곡동(울산)  일동면사무소  고읍  신원동  소사본동  내동  중2동  오정동  송내대로(중동)  운정  파주'
                }
            }
            res.json(send);
            break;

        case '인천':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '청라  송도  신흥  송림  구월동  숭의  석바위  부평역  부평  연희  검단  계산  고잔  석남  송해  동춘  운서  송현  논현  원당  석모리  덕적도  백령도'
                }
            }
            res.json(send);
            break;

        case '대구':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '좌동  진천동  이곡동  시지동  수창동  지산동  서호동  이현동  평리동  대명동  노원동  신암동  태전동  만촌동  호림동  현풍면'
                }
            }
            res.json(send);
            break;

        case '광주':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '서석동  농성동  치평동  두암동  운암동  건국동  송정1동  오선동  주월동  경안동'
                }
            }
            res.json(send);
            break;

        case '대전':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '읍내동  문평동  문창동  구성동  노은동  대흥동1  성남동1  정림동  둔산동  월평동'
                }
            }
            res.json(send);
            break;

        case '울산':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '화산리  상남리  농소동  삼남면  대송동  성남동  부곡동(울산)  여천동(울산)  야음동  삼산동  도로변  신정동  덕신리  무거동  효문동  약사동'
                }
            }
            res.json(send);
            break;

        case '경북':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '칠곡군  장흥동  장량동  대도동  대송면  3공단  성건동  문당동  남문동  공단동  원평동  형곡동  4공단  휴천동  중방동  지품면  화북면  안계면  태하리  상주시'
                }
            }
            res.json(send);
            break;

        case '경남':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '반송로  사파동  경화동  하동읍  동상동  삼방동  장유동  저구리  아주동  사천읍  대산면  북부동  웅상읍  남상면  전포동  회원동  봉암동  상봉동  대안동  상대동  명서동  웅남동  가음정동  용지동  내일동  무전동'
                }
            }
            res.json(send);
            break;

        case '충북':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '옥천읍  영동읍  증평읍  진천읍  송정동(봉명동)  사천동  문화동  용암동  복대동  호암동  칠금동  장락동  오창읍  매포읍  청천면  금왕'
                }
            }
            res.json(send);
            break;

        case '충남':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '성거읍  배방읍  송산면  금산읍  서천읍  서면  당진시청사  도고면  둔포면  인주면  대산리  청양읍  엄사면  성황동  백석동  성성동  사곡면  독곶리  동문동  모종동  파도리  공주  부여읍  논산  이원면  예산군  대천2동  홍성읍  태안읍'
                }
            }
            res.json(send);
            break;

        case '전북':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '중앙동(전주)  진안읍  고산면  요촌동  부안읍  삼천동  팔복동  금암동  신풍동(군산)  소룡동  개정동  남중동  팔봉동  모현동  연지동  죽항동  고창읍  운암면  새만금'
                }
            }
            res.json(send);
            break;

        case '전남':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '용당동  부흥동  서강동  월내동  문수동  여천동(여수)  덕충동  장천동  연향동  순천만  호두리  중동  태인동  진상면  광양읍  나불리  송단리  해남읍  담양읍  장성읍  빛가람동'
                }
            }
            res.json(send);
            break;

        case '제주':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '이도동  연동  동홍동  고산리  성산읍'
                }
            }
            res.json(send);
            break;

        case '세종':
            send = {
                'message': {
                    'text': msg + ' 측정소 목록이다. 이중 골라라.' + '\n' + '\n' + '아름동  신흥동'
                }
            }
            res.json(send);
            break;

        default:
            request(makeUrl(msg), function (error, response, body) {

                var RN = getRandomInt(1, 5);
                $ = cheerio.load(body);

                let totalCnt = $('body').find('totalCount').text();

                if (totalCnt == 0) {
                    send = {
                        'message': {
                            'text': '잘읽어라.' + '\n' + '\n' + '1. 전국 키워드 or 측정소를 입력해라. 전국 키워드를 입력하면 측정소 목록 볼 수 있다.' + '\n' + '\n' + '2. 측정소를 입력하면 미세먼지의 상태 나온다. 기억해라. 측정소 입력!' + '\n' + '\n' + 'ex) 전국: 서울, 인천, 경기, 경북' + '\n' + '\t' + '측정소: 종로구, 성건동' + '\n' + '\n' + '이해 못하면 나혼자 산다 4얼 합류 각 ㅇㅈ?'

                        }
                    }
                    res.json(send);
                } else {
                    $('item').each(function (idx) {


                        let pm10 = $(this).find('pm10Value').text();
                        let dataTime = $(this).find('dataTime').text();
                        let pm25 = $(this).find('pm25Value').text();

                        statePm10 = statePm10Func(pm10);
                        statePm25 = statePm25Func(pm25);

                        //var RanNumTest = getRandomInt(1, 5);

                        Ment1.findOne({
                            'index': RN
                        }).select('ment').exec(function (err, user) {

                            //console.log("q1");
                            mentStr = user.ment;
                            console.log(user.ment + "\n");

                            return;

                        });

                        var finaltxt = '측정소: ' + msg + '\n' + '측정일: ' + dataTime + '\n' + '미세먼지: ' + pm10 + '㎍/㎥' + ', ' + statePm10 + '\n' + '초미세먼지: ' + pm25 + '㎍/㎥' + ', ' + statePm25 + '\n' + '\n' + mentStr;
                        send = {
                            'message': {
                                'text': finaltxt


                            }
                        }
                        //console.log(send);
                        res.json(send);
                        console.log('측정소:', msg);
                        console.log('측정일:', dataTime);
                        console.log('미세먼지:', pm10, '상태:', statePm10);
                        console.log('초미세먼지:', pm25, '상태:', statePm25);
                    });
                }

            });

            break;
    }



    //res.json(send);
    //console.log(send);

});
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
