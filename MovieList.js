//=============================================================
var express = require('express');
const request = require('request');
const config = require('./config.json');
//=============================================================
const LINE_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = config.TOKEN;
const BOXOFFICE_URL = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json'
const KOFIC_KEY = config.KOFIC_KEY;
//=============================================================

export function MovieInfo(replyToken, message) {

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
