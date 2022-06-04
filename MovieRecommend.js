const request = require('request');
var config = require('./config.json');
const TARGET_URL = 'https://api.line.me/v2/bot/message/reply'
const TOKEN = config.TOKEN;
const KOFIC_URL = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest'

//Return random integer.
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Exclude maximum value, include minimum value
}

//Get weekend boxoffice movie code.
//Then return list fill with movie code.
function weekendBoxOfficeMovie() {
    var year = String(getRandomInt(2010,2023));
    var date = String(getRandomInt(1,13));
    if(year == 2022){
        date = String(getRandomInt(1,6));
    }
    if(date < 10){
        date = '0'+date;
    }
    date += '15';
    return new Promise((resolve) => { 
        var moviecode = [];
        request.get(
            {   
                url: KOFIC_URL+`/boxoffice/searchWeeklyBoxOfficeList.json?key=${config.KOFIC_KEY}&targetDt=${year + date}&itemPerPage=7`,
                json:true
            },(error, response, body) => {
                if(!error && response.statusCode == 200) {
                    for(let i = 0; i < body.boxOfficeResult.weeklyBoxOfficeList.length; i++){
                        moviecode.push(body.boxOfficeResult.weeklyBoxOfficeList[i].movieCd)
                    }
                    resolve(moviecode)
            }
        });    
    });
}
//Returns the title, year of release, names of directors and actors.
//The return format is array and index is as follows:
//[title, year of release, director, actor1, actor2]
async function movieinfo(message){
    moviecdlist = await weekendBoxOfficeMovie();
    
    return new Promise((resolve) => {
    movieresult = [];
    for(let i = 0; i < moviecdlist.length; i++){
        request.get(
            {
                url: KOFIC_URL + `/movie/searchMovieInfo.json?key=${config.KOFIC_KEY}&movieCd=${moviecdlist[i]}`,
                json:true
            }
        ,(error,response, body) => {
            if(!error && response.statusCode == 200) {
                for(let j = 0; j < body.movieInfoResult.movieInfo.genres.length; j++){
                    if(body.movieInfoResult.movieInfo.genres[j].genreNm == message){
                        var title = body.movieInfoResult.movieInfo.movieNm;
                        var openyear = body.movieInfoResult.movieInfo.prdtYear;
                        if(body.movieInfoResult.movieInfo.directors.length == 0){
                            var director = "감독정보없음"
                        }
                        else{
                            var director = body.movieInfoResult.movieInfo.directors[0].peopleNm
                        }
                        if(body.movieInfoResult.movieInfo.actors.length == 0){
                            var actor_1 = "배우정보없음"
                            var actor_2 = "배우정보없음"
                        }
                        else if(body.movieInfoResult.movieInfo.actors.length == 1){
                            var actor_1 = body.movieInfoResult.movieInfo.actors[0].peopleNm
                            var actor_2 = "배우정보없음"
                        }
                        else{
                            var actor_1 = body.movieInfoResult.movieInfo.actors[0].peopleNm
                            var actor_2 = body.movieInfoResult.movieInfo.actors[1].peopleNm
                        }
                        movieresult.push([title, openyear, director, actor_1, actor_2])

                    } //제목, 개봉년도, 감독, 배우1, 배우2
                }
                resolve(movieresult);
                }
            });
        }
    });
}

//Enter a movie genre in the message variable.
//It will then return movie title, year of release, director and actor information to Line Messenger.
exports.movieRecommend = async function(replyToken, message){
    var movieresult = [];
    while(1){
        movielist = await movieinfo(message);
        for(let i = 0; i < movielist.length; i ++){
            movieresult.push(movielist[i]);
        }
        if(movieresult.length > 1){
            break;
        }
    }
    var movierecommend_output = '';
    for(let i = 0; i < movieresult.length; i++){
        movierecommend_output += `제목: ${movieresult[i][0]}(${movieresult[i][1]})\n감독: ${movieresult[i][2]}\n배우: ${movieresult[i][3]}, ${movieresult[i][4]}\n`
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
                        "text":movierecommend_output
                    }
                ]
            }
        },(error, response, body) => {
            console.log(body)
    });
}