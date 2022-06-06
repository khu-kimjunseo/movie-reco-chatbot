var express = require('express');
const request = require('request');
var config = require('./config.json');
const TARGET_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = config.TOKEN;
const KOFIC_URL = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest'

//Enter a movie title in the message variable.
//It will then return the movie title, director, and actor information to Line Messenger.
exports.movielist = function (replyToken, message) {
    var encodedMessage = encodeURI(message);
    request.get(
        {   
            url: KOFIC_URL+`/movie/searchMovieList.json?key=${config.KOFIC_KEY}&movieNm=${encodedMessage}`,
            json:true
        },(error, response, body) => {
            if(!error && response.statusCode == 200) {
                console.log(body.message);
                var result = '', movieNm, prdtYear, directors;
                for (let i = 0; i < body.movieListResult.movieList.length; i ++){
                    movieNm = body.movieListResult.movieList[i].movieNm;
                    prdtYear = body.movieListResult.movieList[i].prdtYear;
                    movieCd = body.movieListResult.movieList[i].movieCd;
                    if(body.movieListResult.movieList[i].directors.length === 0){
                        directors = "감독정보없음"
                    }
                    else{
                        directors = body.movieListResult.movieList[i].directors[0].peopleNm;
                    }
                    result += '제목: ' + movieNm + `(${prdtYear})` + '\n' + '감독: ' + directors +  '\n' + '영화코드: ' + movieCd + '\n';
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
