

// 어제 기준 영화 순위(1위 ~ 5위) 출력
exports.ShowYesterdayRank = function(replyToken) {
    
    var yesterday = GetYesterday();
    
    request.get(
        {
            url: BOXOFFICE_URL+`?key=${KOFIC_KEY}&targetDt=${yesterday}`,
            json:true
        },(error, response, body) => {
            if(!error && response.statusCode == 200) {
                console.log(body.boxOfficeResult);
                
                var movie_1st = body.boxOfficeResult.dailyBoxOfficeList[0].movieNm;
                var movie_2nd = body.boxOfficeResult.dailyBoxOfficeList[1].movieNm;
                var movie_3rd = body.boxOfficeResult.dailyBoxOfficeList[2].movieNm;
                var movie_4th = body.boxOfficeResult.dailyBoxOfficeList[3].movieNm;
                var movie_5th = body.boxOfficeResult.dailyBoxOfficeList[4].movieNm;

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
                                    "text": 
                                    `1위 : ${movie_1st}\n`+
                                    `2위 : ${movie_2nd}\n`+
                                    `3위 : ${movie_3rd}\n`+
                                    `4위 : ${movie_4th}\n`+
                                    `5위 : ${movie_5th}\n`
                                }
                            ]
                        }
                    },(error, response, body) => {
                        console.log(body)
                    });
            }
        });
}


// 어제 날짜를 YYYYMMDD 형식(type: string)으로 반환하는 함수
exports.GetYesterday = function() {

    var today = new Date();
    var yesterday = new Date(today.setDate(today.getDate() - 1));
    
    var year = yesterday.getFullYear();
    var month = ('0' + (yesterday.getMonth() + 1)).slice(-2);
    var day = ('0' + yesterday.getDate()).slice(-2);

    return (year + month + day);
}  