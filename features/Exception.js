//=============================================================
var express = require('express');
const request = require('request');
const config = require('../config.json');
//=============================================================
const LINE_URL = 'https://api.line.me/v2/bot/message';
const TOKEN = config.TOKEN;
//=============================================================

exports.SayIDontKnow = function (replyToken) {
    request.post(
        {
            url: LINE_URL + '/reply',
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken": replyToken,
                "messages": [
                    {
                        "type": "text",
                        "text": "이해하지 못했습니다."
                    },
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

exports.ShowGenre = function (replyToken) {
    request.post(
        {
            url: LINE_URL + '/reply',
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken": replyToken,
                "messages": [
                    {
                        "type": "text",
                        "text": "다음 영화 장르 중 하나를 선택해주세요.\n"+
                        "드라마 / 코미디 / 액션 / 멜로/로맨스 / 스릴러 / 미스터리 / 공포(호러) / 어드벤처 / 범죄 / 가족 / 판타지 / SF / 사극 / 애니메이션 / 다큐멘터리 / 전쟁 / 뮤지컬 / 기타"
                    }
                ]
            }
        }, (error, response, body) => {
            console.log(body)
        });
}

exports.ShowSearch = function (replyToken) {
    request.post(
        {
            url: LINE_URL + '/reply',
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            },
            json: {
                "replyToken": replyToken,
                "messages": [
                    {
                        "type": "text",
                        "text": "검색할 단어를 입력해주세요."
                    }
                ]
            }
        }, (error, response, body) => {
            console.log(body)
        });
}