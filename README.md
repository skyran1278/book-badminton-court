# book-badminton-court

他們是用中央控管的 session id 進行管理
所以需要先登入，讓 session id 登入進他們的資料庫
再發送 http request

線索：新的瀏覽器，每次都會產生新的 session id
vw15jsl2cd1luechox0eouzh
e3xuwiraje20xhnmgy13rorz
wvsc5vclfrx4qwpmvr3izemv
0txup1kqd13uc1v0nxvd2ypz

分成兩種方式

本地開發, 起 docker container (index.js)
環境變數要用 .env 檔案

也可以用 lambda function (lambda.js)
環境變數用雲端

帳號密碼都有名字, 現在看來不是很理想, 但無傷大雅就這樣吧
