
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
