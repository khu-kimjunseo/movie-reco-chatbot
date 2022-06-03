//=============================================================
var express = require('express');
const request = require('request');
const config = require('./config.json');
const dailyBoxOfficeList = require('./DailyBoxOfficeList.js');
//=============================================================
const LINE_URL = 'https://api.line.me/v2/bot/message/reply'
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


// RECEIVE MESSAGE
app.post('/hook', function (req, res) {

  var eventObj = req.body.events[0];

  // console.log for debugging
  console.log('======================', new Date() ,'======================');
  console.log('[request]', req.body);
  console.log('[request source] ', eventObj.source);
  console.log('[request message]', eventObj.message);

  ClassifyMessage(eventObj.replyToken, eventObj.message.text);

  res.sendStatus(200);
});


// CLASSIFY MESSAGE
function ClassifyMessage(replyToken, imessage){

  var message = String(imessage);

  // 사용자가 보낸 라인 메시지 문자열 안에 특정 문자열이 있으면, 특정 함수 실행
  if(message.includes('최신') || message.includes('순위') || message.includes('오늘') || message.includes('추천')) {
    dailyBoxOfficeList.ShowYesterdayRank(replyToken);
  } else if (message.includes('줄거리')) {
      // (예시) 영화 줄거리 출력
  }
  else if (message.includes('목록')) {
      // (예시) 영화 목록 출력
  }
}


// ※ WARNING: DO NOT TOUCH THIS CODE SECTION ※
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