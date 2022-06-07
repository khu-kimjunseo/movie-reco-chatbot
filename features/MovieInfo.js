//=============================================================
var express = require('express');
const request = require('request');
const config = require('../config.json');
//=============================================================
const LINE_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = config.TOKEN;
const KOFIC_URL = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest'
const KOFIC_KEY = config.KOFIC_KEY;
//=============================================================

exports.MovieInfo = function(replyToken, message) {
    request.get(
        {
            url: KOFIC_URL+`/movie/searchMovieInfo.json?key=${KOFIC_KEY}&movieCd=${message}`,
            json:true
        },(error, response, body) => {
            if(!error && response.statusCode == 200) {
                console.log(body.movieInfoResult);
                var MovieInfo = body.movieInfoResult.movieInfo;
                var MovieName = MovieInfo.movieNm;
                var MovieDate = `${MovieInfo.openDt.slice(0,4)}년 ${MovieInfo.openDt.slice(4,6)}월 ${MovieInfo.openDt.slice(6,8)}일`;
                var MovieTime = MovieInfo.showTm;
                var MovieGenres = [];
                for(var i in MovieInfo.genres)
                {
                    MovieGenres.push(MovieInfo.genres[i].genreNm);
                }
                var MovieDirec = MovieInfo.directors[0].peopleNm;
                var MovieActors = [];
                for(var i=0; i<MovieInfo.actors.length && i<5; i++)
                {
                    MovieActors[i] = MovieInfo.actors[i].peopleNm;
                }

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
                                    "text":`[영화명]: ${MovieName}\n[개봉날짜]: ${MovieDate}\n[상영시간]: ${MovieTime}분\n[장르]: ${MovieGenres}\n[감독]: ${MovieDirec}\n[출연배우]: ${MovieActors}`
                                }
                            ]
                        }
                    },(error, response, body) => {
                        console.log(body)
                    });
            }
        });
}
