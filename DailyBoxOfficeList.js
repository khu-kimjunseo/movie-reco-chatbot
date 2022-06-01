var express = require('express');
const request = require('request');

// 라인 API 요청 URL(메시징 API)
const LINE_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = ''

// 한국영화진흥위원회 API 요청 URL(일별 박스오피스)
const BOXOFFICE_URL = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json'
// 한국영화진흥위원회 API 발급 받은 키
const KOFIC_KEY = ''


// ================== SETTINGS ==================
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "" 
const sslport = 23023;
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
// ===============================================


// [MAIN] CLASSIFY THE MESSAGE
function ClassifyMessage(replyToken, imessage){

    var message = String(imessage);

    if(message.includes('최신') || message.includes('순위') || message.includes('오늘')) {
        showYesterdayRank(replyToken);
    } else if (message.includes('줄거리')) {
        // (예시) 영화 줄거리 출력
    }
    else if (message.includes('목록')) {
        // (예시) 영화 목록 출력
    }
}


// 사용자의 LINE message 수신
app.post('/hook', function (req, res) {

    var eventObj = req.body.events[0];

    // (디버깅용) req.body 내용 콘솔로 확인
    console.log('======================', new Date() ,'======================');
    console.log('[request]', req.body);
    console.log('[request source] ', eventObj.source);
    console.log('[request message]', eventObj.message);

    ClassifyMessage(eventObj.replyToken, eventObj.message.text);

    res.sendStatus(200);
});


// 어제 영화 순위 1위 ~ 5위 출력
function showYesterdayRank(replyToken) {

    var yesterday = GetYesterday();
    request.get(
        {
            url: BOXOFFICE_URL+`?key=${KOFIC_KEY}&targetDt=${yesterday}`,
            json:true
        },(error, response, body) => {
            if(!error && response.statusCode == 200) {
                console.log(body.boxOfficeResult);
                
                var movie_1st = body.boxOfficeResult.dailyBoxOfficeList[0].movieNm;
                var movie_2nd = body.boxOfficeResult.dailyBoxOfficeList[1].movieNm;
                var movie_3rd = body.boxOfficeResult.dailyBoxOfficeList[2].movieNm;
                var movie_4th = body.boxOfficeResult.dailyBoxOfficeList[3].movieNm;
                var movie_5th = body.boxOfficeResult.dailyBoxOfficeList[4].movieNm;

                request.post(
                    {
                        url: LINE_URL,
                        headers: {
                            'Authorization': `Bearer ${TOKEN}`
                        },
                        json: {
                            "replyToken":replyToken,
                            "messages":[
                                {
                                    "type":"text",
                                    "text": 
                                    `1위 : ${movie_1st}\n`+
                                    `2위 : ${movie_2nd}\n`+
                                    `3위 : ${movie_3rd}\n`+
                                    `4위 : ${movie_4th}\n`+
                                    `5위 : ${movie_5th}\n`
                                }
                            ]
                        }
                    },(error, response, body) => {
                        console.log(body)
                    });
            }
        });
}


// 어제 날짜를 YYYYMMDD 형식(type: string)으로 반환하는 함수
function GetYesterday() {
    
    var today = new Date();
    var yesterday = new Date(today.setDate(today.getDate() - 1));
    
    var year = yesterday.getFullYear();
    var month = ('0' + (yesterday.getMonth() + 1)).slice(-2);
    var day = ('0' + yesterday.getDate()).slice(-2);

    return (year + month + day);
}


// ※ WARNING: DO NOT TOUCH THIS CODE SECTION
try {
    const option = {
      ca: fs.readFileSync('/etc/letsencrypt/live/' + domain +'/fullchain.pem'),
      key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/privkey.pem'), 'utf8').toString(),
      cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/cert.pem'), 'utf8').toString(),
    };
  
    HTTPS.createServer(option, app).listen(sslport, () => {
      console.log(`[HTTPS] Server is started on port ${sslport}`);
    });
  } catch (error) {
    console.log('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
    console.log(error);
  }
  