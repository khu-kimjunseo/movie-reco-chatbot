//=============================================================
var express = require('express');
const request = require('request');
const config = require('./config.json');
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
                    }
                ]
            }
        }, (error, response, body) => {
            console.log(body)
        });
}

exports.test_1 = function (replyToken) {
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
                        "text": "영화 장르를 선택해주세요."
                    }
                ]
            }
        }, (error, response, body) => {
            console.log(body)
        });
}

exports.test_2 = function (replyToken) {
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