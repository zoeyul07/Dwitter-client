import axios from "axios";
import axiosRetry from "axios-retry";

export default class HttpClient {
  constructor(baseURL, authErrorEventBus, getCsrfToken) {
    this.authErrorEventBus = authErrorEventBus;
    this.getCsrfToken = getCsrfToken;
    this.client = axios.create({
      baseURL: baseURL,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    axiosRetry(this.client, {
      retires: 5,
      retryDelay: (retry) => {
        //일정하게가 아닌 요청시마다 기다리는 시간이 늘어나도록

        const delay = Math.pow(2, retry) * 100; //100, 200, 400, 800, 1600;
        //비규직척으로 요청(jittering)
        //102초..105초.. 등 10% 이내 랜덤하게
        const jitter = delay * 0.1 * Math.random(); //10,, 20, ...160 내외의 랜덤한 숫자

        return delay + jitter;
      },
      //네트워크 에러 및 요청에 실패했을 경우에만 재시도 되지 않고 get 등의 서버 State를 바꾸지 않는 경우 혹은 429 일 경우 재시도 되도록
      retry: (err) =>
        axiosRetry.isNetworkOrIdempotentRequestError(err) ||
        err.response.statusCode === 429,
    });
  }

  async fetch(url, options) {
    const { body, method, headers } = options;
    const req = {
      url,
      method,
      headers: { ...headers, "dwitter-csrf-token": this.getCsrfToken() },
      data: body,
    };

    try {
      const res = await this.client(req);
      return res.data;
    } catch (err) {
      if (err.response) {
        const data = err.response.data;
        const message =
          data && data.message ? data.message : "Something went wrong! 🤪";

        throw new Error(message);
      }
      throw new Error("connection error");
    }
  }
}
