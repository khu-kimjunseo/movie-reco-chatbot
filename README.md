<!-- ABOUT THE PROJECT -->
## 📽️ 영화 추천 채팅봇
영화 추천 및 정보 조회 기능이 있는 채팅봇입니다.

## About The Project

* 최신 영화 목록을 확인할 수 있습니다.
* 특정 키워드를 통해 영화를 검색할 수 있습니다.
* 장르별 영화를 추천해줍니다.
* 영화의 상세 정보를 확인할 수 있습니다.

## Built With

* [Node.js](https://nodejs.org/ko/)
* [Express](https://expressjs.com/ko/)
* [Javascript](https://developer.mozilla.org/ko/docs/Web/JavaScript)
* [영화진흥위원회 API](https://www.kobis.or.kr)
* [LINE Messaging API](https://developers.line.biz/en/services/messaging-api/)


## Installation

1. [영화진흥위원회 API](https://www.kobis.or.kr/kobisopenapi/homepg/main/main.do)에서 무료 API 키를 발급 받습니다
2. 리포지토리를 클론합니다.
   ```
   git clone http://khuhub.khu.ac.kr/2018104006/movie-reco-chatbot.git
   ```
3. NPM packages 설치합니다.
   ```
   npm install
   ```
4. `config.json` 파일 안에 발급받은 API 키를 추가합니다.
   ```
   "KOFIC_KEY" : "Insert user key value";
   ```
5. 라인 어플리케이션에서 챗봇을 친구로 추가합니다.
   Chatbot ID :  @093sjoog
   <div align="center"><img src="./images/QRcode.png" width="20%" height="20%"></div>
   

<!-- USAGE EXAMPLES -->
## Usage
다음 명령을 입력하여 프로그램을 실행합니다.
   ```sh
   npm start
   ```
1. 최신 영화 추천 받기 : 어제 날짜를 기준으로 최신 영화를 추천 받습니다.
2. 장르별 영화 추천 받기 : 장르를 선택하여, 해당 장르 영화를 추천 받습니다.
3. 영화 검색하기 : 특정 단어를 입력하면, 해당 단어를 제목에 포함하고 있는 영화목록을 출력합니다.
4. 영화 상세검색 : 영화 코드를 입력하면, 해당 영화에 대한 상세 정보를 조회할 수 있습니다.


<!-- CONTRIBUTING -->
## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request.
1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch 
5. Open a Pull Request


<!-- LICENSE -->
## License
Distributed under the MIT License. See `LICENSE.txt` for more information.


<!-- CONTACT -->
## Contact

* 김준서 : juny7s6@khu.ac.kr
* 백승욱 : bpsswu@khu.ac.kr
* 문성준: hoynola@khu.ac.kr 

* Project Link : http://khuhub.khu.ac.kr/2018104006/movie-reco-chatbot
