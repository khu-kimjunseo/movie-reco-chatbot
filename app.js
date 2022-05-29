var express = require('express');
const request = require('request');
const TARGET_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = 'ejLSECVgPBYNuEumq2Nw0w9ibDBoK9ixMnOp4jk41cLqHU5+vL1s5q7L4Ko7QcEiSCq1eJc1dPzG5P7HbbOKx490Oe6S1qZ7ob3YiTyfNN1NuOTm9jNYW22ctklbb8tFlDIDgSZbwz48jvQmAbdY9QdB04t89/1O/w1cDnyilFU='
const KOFIC_URL = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json'
const KOFIC_KEY = 'fc36c6b83d1b3f06d8dc861b7e22787b'

const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "2018102181.osschatbot2022.tk"
const sslport = 23023;
const bodyParser = require('body-parser');
var app = express();
var translang = 'en';
app.use(bodyParser.json());
app.post('/hook', function (req, res) {

    var eventObj = req.body.events[0];
    var source = eventObj.source;
    var message = eventObj.message;

    // request log
    console.log('======================', new Date() ,'======================');
    console.log('[request]', req.body);
    console.log('[request source] ', eventObj.source);
    console.log('[request message]', eventObj.message);

    MovieInfo(eventObj.replyToken, eventObj.message.text);
    

    res.sendStatus(200);
});

function MovieInfo(replyToken, message) {

    request.get(
        {
            url: KOFIC_URL+`?key=${KOFIC_KEY}&movieCd=${message}`,
            json:true
        },(error, response, body) => {
            if(!error && response.statusCode == 200) {
                console.log(body.movieInfoResult);
                var MovieInfo = body.movieInfoResult.movieInfo;
                request.post(
                    {
                        url: TARGET_URL,
                        headers: {
                            'Authorization': `Bearer ${TOKEN}`
                        },
                        json: {
                            "replyToken":replyToken,
                            "messages":[
                                {
                                    "type":"text",
                                    "text":`영화명: ${MovieInfo.movieNm}\n개봉날짜: ${MovieInfo.prdtYear}\n상영시간: ${MovieInfo.showTm}분\n장르: ${MovieInfo.genres[0].genreNm}\n감독: ${MovieInfo.directors[0].peopleNm}\n출연배우: ${MovieInfo.actors[0].peopleNm},${MovieInfo.actors[1].peopleNm},${MovieInfo.actors[2].peopleNm},${MovieInfo.actors[3].peopleNm}`
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
  