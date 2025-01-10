import { _decorator, Component, Node } from 'cc';
import Request from './Request';
const { ccclass, property } = _decorator;

@ccclass('APIManager')
export class APIManager extends Component {

    public static urlAPI: string = "https://api-tele.gamebatta.com";// batta
    // public static urlAPI: string = "https://cdn-game.gamebatta.com";// batta

    public static gameID = 35; //tetris
    public static key = 'aee448b0-a4a6-4c1f-b2ec-da932956412e';

    // Gọi hàm khi lần đầu tiên vào game
    public static LoginBata() {
        const url = APIManager.urlAPI + '/user-service/game/login';
        const data = {
            "gameId" : APIManager.gameID
        }
        APIManager.CallPost(data, url, (response) => {
            // Xử lý lưu id
            console.log(response);
        }, (xhr) => {
            xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIyIiwidXNlcm5hbWUiOiJxdWFuZy5xdXkuOTY1QGdtYWlsLmNvbSIsImVtYWlsIjoicXVhbmcucXV5Ljk2NUBnbWFpbC5jb20iLCJpc0NyZWF0b3JzIjpmYWxzZSwicmFuayI6IkJyb256ZSIsImlhdCI6MTczNTUzMTY3MywiZXhwIjoxNzM1NTQyNDczfQ.Z6wwSD0eA0VNjFJbkTuNbNCmZqkb-_cnr4orwT3d0fc' );
            // xhr.setRequestHeader('Authorization', 'Bearer ' + APIManager.urlParam(`token`));
            xhr.setRequestHeader('game_key', APIManager.key);
            xhr.setRequestHeader("Content-type", "application/json");
        });
    }

    public static requestData(key: string, data: any, callBack: (response: any) => void) {
        const url = APIManager.urlAPI + key;
        APIManager.CallPost(data, url, (response) => {
            callBack(response);
        }, (xhr) => {
            xhr.setRequestHeader('Authorization', 'Bearer ' + APIManager.urlParam(`token`));
            xhr.setRequestHeader('game_key', APIManager.key);
            xhr.setRequestHeader("Content-type", "application/json");
        });
    }

    public static CallPost(data, url, callback, callbackHeader) {
        let param = this;
        var xhr = new XMLHttpRequest();

        xhr.onerror = () => {
        };

        xhr.ontimeout = () => {
        }

        xhr.onabort = () => {
        }

        xhr.onloadend = () => {
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;
            if (xhr.status == 200 && xhr.responseText) {
                var response = JSON.parse(xhr.responseText);

                if (response.d) {
                    response.d = Request.decryptDataTS(response.d);
                    response.d = JSON.parse(response.d) || response.d;
                };
                console.log("CallPost=>", url, "\n", response);

                callback(response);
            }
        };
        xhr.open('POST', url, true);
        callbackHeader(xhr);
        let body
        if (data != null){
            data.timestamp = Date.now();
            // body = JSON.stringify(data);
            body = Request.encryptDataTS(data);
        }
        else{
            body = JSON.stringify({
                data: null,
                timestamp: Date.now(),
            });
            body = Request.encryptDataTS(data);
        }
        xhr.send(body);
    }

    public static urlParam(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.search);
        return (results !== null) ? results[1] || 0 : false;
    }
}