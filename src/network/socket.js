import socket from "socket.io-client";

export default class Socket {
  constructor(baseURL, getAccessToken) {
    //query를 통해서 보내는 경우 브라우저 상에서 , 콘솔에서 토큰이 보일 수 있있고, 로그에도 남을 수 있기때문에 socket 이용시 handshake 안에 auth를 사용해야한다.
    this.io = socket(baseURL, { auth: (cb) => cb({ token: getAccessToken }) });

    this.io.on("connect_error", (err) => {
      console.log("socket error", err.message);
    });
  }

  onSync(event, callback) {
    if (!this.io.connected) {
      this.io.connect();
    }

    this.io.on(event, (message) => callback(message));
    return () => this.io.off(event);
  }
}
