var express = require('express');
const request = require('request');
var config = require('./config.json');
const TARGET_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = config.TOKEN;
const KOFIC_URL = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json'
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = config.domain;
const sslport = 23023;
const bodyParser = require('body-parser');
var app = express();
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

    trans(eventObj.replyToken, eventObj.message.text);
    

    res.sendStatus(200);
});

// message insert: Inquiry start opening year,Inquiry end opening year
// ex) 2019,2020
function trans(replyToken, message) {
    var my_message, copied_message;
    copied_message = message
    my_message = copied_message.split(',');
    request.get(
        {
            url: KOFIC_URL+`?key=${config.KOFIC_KEY}&openStartDt=${my_message[0]}&openEndDt=${my_message[1]}}`,
            json:true
        },(error, response, body) => {
            if(!error && response.statusCode == 200) {
                console.log(body.message);
                var result = '', movieNm, prdtYear, directors;
                for (let i = 0; i < body.movieListResult.movieList.length; i ++){
                    movieNm = body.movieListResult.movieList[i].movieNm;
                    prdtYear = body.movieListResult.movieList[i].prdtYear;
                    if(body.movieListResult.movieList[i].directors.length === 0){
                        directors = "감독정보없음"
                    }
                    else{
                        directors = body.movieListResult.movieList[i].directors[0].peopleNm;
                    }
                    result += '제목: ' + movieNm + `(${prdtYear})` + '\n' + '감독: ' + directors +  '\n';
                }
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
                                    "text":result
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
  