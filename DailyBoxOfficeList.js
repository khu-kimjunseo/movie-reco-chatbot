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


app.post('/hook', function (req, res) {

    var eventObj = req.body.events[0];

    // (디버깅용) req.body 내용 콘솔로 확인
    console.log('======================', new Date() ,'======================');
    console.log('[request]', req.body);
    console.log('[request source] ', eventObj.source);
    console.log('[request message]', eventObj.message);

    showYesterdayRank(eventObj.replyToken, eventObj.message.text);
    res.sendStatus(200);
});

// 해당 날짜 영화 순위 출력 함수
// 입력 인자 중 message 에는 어제 날짜 들어감(ex: 20220528)
function showYesterdayRank(replyToken, message) {

    // 한국영화진흥위원회 API는 get 형태로 호출
    request.get(
        {
            url: BOXOFFICE_URL+`?key=${KOFIC_KEY}&targetDt=${message}`,
            json:true
        },(error, response, body) => {
            if(!error && response.statusCode == 200) {
                console.log(body.boxOfficeResult);
                
                var transMessage_1 = body.boxOfficeResult.dailyBoxOfficeList[0].movieNm;
                var transMessage_2 = body.boxOfficeResult.dailyBoxOfficeList[1].movieNm;
                var transMessage_3 = body.boxOfficeResult.dailyBoxOfficeList[2].movieNm;
                var transMessage_4 = body.boxOfficeResult.dailyBoxOfficeList[3].movieNm;

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
                                    "text": `1위 : ${transMessage_1}\n2위 : ${transMessage_2}\n3위 : ${transMessage_3}\n4위 : ${transMessage_4}`
                                }
                            ]
                        }
                    },(error, response, body) => {
                        console.log(body)
                    });
            }
        });
}

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
  