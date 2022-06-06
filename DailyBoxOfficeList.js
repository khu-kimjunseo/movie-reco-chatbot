//=============================================================
var express = require('express');
const request = require('request');
const config = require('./config.json');
//=============================================================
const LINE_REPLY_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = config.TOKEN;
const KOFIC_URL = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest'
const KOFIC_KEY = config.KOFIC_KEY;
//=============================================================

// 어제 기준 영화 순위(1위 ~ 5위) 출력
exports.ShowYesterdayRank = function (replyToken) {

    var yesterday = exports.GetYesterday();

    request.get(
        {
            url: KOFIC_URL + `/boxoffice/searchDailyBoxOfficeList.json?key=${KOFIC_KEY}&targetDt=${yesterday}`,
            json: true
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {

                var movieName = [];
                movieName[0] = body.boxOfficeResult.dailyBoxOfficeList[0].movieNm;
                movieName[1] = body.boxOfficeResult.dailyBoxOfficeList[1].movieNm;
                movieName[2] = body.boxOfficeResult.dailyBoxOfficeList[2].movieNm;
                movieName[3] = body.boxOfficeResult.dailyBoxOfficeList[3].movieNm;
                movieName[4] = body.boxOfficeResult.dailyBoxOfficeList[4].movieNm;

                var movieOpenDt = [];
                movieOpenDt[0] = body.boxOfficeResult.dailyBoxOfficeList[0].openDt;
                movieOpenDt[1] = body.boxOfficeResult.dailyBoxOfficeList[1].openDt;
                movieOpenDt[2] = body.boxOfficeResult.dailyBoxOfficeList[2].openDt;
                movieOpenDt[3] = body.boxOfficeResult.dailyBoxOfficeList[3].openDt;
                movieOpenDt[4] = body.boxOfficeResult.dailyBoxOfficeList[4].openDt;

                var movieAudiAcc = [];
                movieAudiAcc[0] = exports.numberWithCommas(body.boxOfficeResult.dailyBoxOfficeList[0].audiAcc);
                movieAudiAcc[1] = exports.numberWithCommas(body.boxOfficeResult.dailyBoxOfficeList[1].audiAcc);
                movieAudiAcc[2] = exports.numberWithCommas(body.boxOfficeResult.dailyBoxOfficeList[2].audiAcc);
                movieAudiAcc[3] = exports.numberWithCommas(body.boxOfficeResult.dailyBoxOfficeList[3].audiAcc);
                movieAudiAcc[4] = exports.numberWithCommas(body.boxOfficeResult.dailyBoxOfficeList[4].audiAcc);

                var movieCode = [];
                movieCode[0] = body.boxOfficeResult.dailyBoxOfficeList[0].movieCd;
                movieCode[1] = body.boxOfficeResult.dailyBoxOfficeList[1].movieCd;
                movieCode[2] = body.boxOfficeResult.dailyBoxOfficeList[2].movieCd;
                movieCode[3] = body.boxOfficeResult.dailyBoxOfficeList[3].movieCd;
                movieCode[4] = body.boxOfficeResult.dailyBoxOfficeList[4].movieCd;

                request.post(
                    {
                        url: LINE_REPLY_URL,
                        headers: {
                            'Authorization': `Bearer ${TOKEN}`
                        },
                        json: {
                            "replyToken": replyToken,
                            "messages": [
                                {
                                    "type": "text",
                                    "text":
                                        `[1위]\n영화제목 : ${movieName[0]}\n개봉일 : ${movieOpenDt[0]}\n누적 관객 수 : ${movieAudiAcc[0]}명\n영화코드 : ${movieCode[0]}\n\n` +
                                        `[2위]\n영화제목 : ${movieName[1]}\n개봉일 : ${movieOpenDt[1]}\n누적 관객 수 : ${movieAudiAcc[1]}명\n영화코드 : ${movieCode[1]}\n\n` +
                                        `[3위]\n영화제목 : ${movieName[2]}\n개봉일 : ${movieOpenDt[2]}\n누적 관객 수 : ${movieAudiAcc[2]}명\n영화코드 : ${movieCode[2]}\n\n` +
                                        `[4위]\n영화제목 : ${movieName[3]}\n개봉일 : ${movieOpenDt[3]}\n누적 관객 수 : ${movieAudiAcc[3]}명\n영화코드 : ${movieCode[3]}\n\n` +
                                        `[5위]\n영화제목 : ${movieName[4]}\n개봉일 : ${movieOpenDt[4]}\n누적 관객 수 : ${movieAudiAcc[4]}명\n영화코드 : ${movieCode[4]}\n\n` +
                                        `영화 상세 정보를 조회하시려면, 영화코드를 입력해주세요.`
                                }
                            ]
                        }
                    }, (error, response, body) => {
                        console.log(body)
                    });
            }
        });
}


// 어제 날짜를 YYYYMMDD 형식(type: string)으로 반환하는 함수
exports.GetYesterday = function () {

    var today = new Date();
    var yesterday = new Date(today.setDate(today.getDate() - 1));

    var year = yesterday.getFullYear();
    var month = ('0' + (yesterday.getMonth() + 1)).slice(-2);
    var day = ('0' + yesterday.getDate()).slice(-2);

    return (year + month + day);
}


// 숫자 사이에 콤마(,) 찍고 반환하는 함수(입력, 출력 모두 문자열)
exports.numberWithCommas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
