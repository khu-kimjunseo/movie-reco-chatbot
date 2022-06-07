//=============================================================
var express = require('express');
const request = require('request');
const config = require('./config.json');
//=============================================================
const LINE_URL = 'https://api.line.me/v2/bot/message';
const TOKEN = config.TOKEN;
const KOFIC_URL = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest';
const KOFIC_KEY = config.KOFIC_KEY;
//=============================================================
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = config.domain;
const sslport = 23023;
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
//=============================================================
var BoxOffice = require('./features/DailyBoxOfficeList.js');
var MovieList = require('./features/MovieList.js');
var MovieInfo = require('./features/MovieInfo.js');
var MovieReco = require('./features/MovieRecommend.js');
var Exception = require('./features/Exception.js');
//=============================================================
const user_id = config.USER_ID;
//=============================================================


// SHOW MENU
function ShowMenu(replyToken) {
  request.post({
    url: LINE_URL + '/reply',
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    },
    json: {
      "replyToken":replyToken,
      "messages": [
        {
          "type": "text",
          "text": "[0번 입력] : 메뉴 출력\n[1번 입력] : 최신영화 추천\n[2번 입력] : 장르별 영화 추천\n[3번 입력] : 영화 검색하기\n**영화코드 입력 : 영화 상세정보 조회"
        }
      ]
    }
  }, (error, response, body) => {
    console.log(body)
  });
}

ShowMenu();


// RECEIVE MESSAGE
app.post('/hook', function (req, res) {

  var eventObj = req.body.events[0];

  Response(eventObj.replyToken, eventObj.message.text);

  res.sendStatus(200);
});


var flag_2 = 0;
var flag_3 = 0;

// RESPONSE TO MESSAGE
function Response(replyToken, message) {
  if (isNaN(message) === false && message.length === 8) {
    MovieInfo.MovieInfo(replyToken, message);
  }
  else if (message == '0' || message == '0번') {
    ShowMenu(replyToken);
  }
  else if (message == '1' || message == '1번') {
    BoxOffice.ShowYesterdayRank(replyToken);
  }
  else if ((message == '2' || message == '2번') && flag_2 == 0) {
    flag_2 = 1;
    Exception.ShowGenre(replyToken);
  }
  else if ((message == '3' || message == '3번') && flag_3 == 0) {
    flag_3 = 1;
    Exception.ShowSearch(replyToken);
  }
  else if (flag_2 == 1) {
    flag_2 = 0;
    MovieReco.movieRecommend(replyToken, message);
  }
  else if (flag_3 == 1) {
    flag_3 = 0;
    MovieList.movielist(replyToken, message);
  }
  else {
    Exception.SayIDontKnow(replyToken);
  }
}


// ※ WARNING: DO NOT TOUCH THIS CODE SECTION ※
try {
  const option = {
    ca: fs.readFileSync('/etc/letsencrypt/live/' + domain + '/fullchain.pem'),
    key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain + '/privkey.pem'), 'utf8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain + '/cert.pem'), 'utf8').toString(),
  };

  HTTPS.createServer(option, app).listen(sslport, () => {
    console.log(`[HTTPS] Server is started on port ${sslport}`);
  });
} catch (error) {
  console.log('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
  console.log(error);
}