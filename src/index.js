import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AuthService from "./service/auth";
import TweetService from "./service/tweet";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, fetchToken } from "./context/AuthContext";
import { AuthErrorEventBus } from "./context/AuthContext";
import HttpClient from "./network/http";

import socket from "socket.io-client";
import Socket from "./network/socket";

const baseURL = process.env.REACT_APP_BASE_URL;

const httpClient = new HttpClient(baseURL);
const authErrorEventBus = new AuthErrorEventBus();
const authService = new AuthService(httpClient);

//socket은 브라우저에서 자동으로 토큰을 설정해주지 않음
//메모리에 저장해 소켓에 전달한다.
//메모리는 보안에 안전
const socketClient = new Socket(baseURL, () => fetchToken());
const tweetService = new TweetService(httpClient, socketClient);

const socketIO = socket(baseURL);

socketIO.on("connect_error", (error) => {
  console.log("socket error", error);
});

socketIO.on("dwitter", (msg) => {
  console.log(msg);
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider
        authService={authService}
        authErrorEventBus={authErrorEventBus}
      >
        <App tweetService={tweetService} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
