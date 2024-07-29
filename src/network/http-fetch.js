export default class HttpClient {
  constructor(baseURL, authErrorEventBus, getCsrfToken) {
    this.baseURL = baseURL;
    this.authErrorEventBus = authErrorEventBus;
    this.getCsrfToken = getCsrfToken;
  }

  async fetch(url, options) {
    const res = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        "dwitter-csrf-token": this.getCsrfToken(),
      },
      //자동으로 브라우저가 credential에 있는 정보를 추가해, cookie에 있는 정보를 읽어 추가해준다.
      credentials: "include",
    });

    try {
      const data = await res.json();
      if (res.status > 299 || res.status < 200) {
        const message =
          data && data.message ? data.message : "Something went wrong! 🤪";
        const error = new Error(message);

        if (res.status === 401) {
          this.authErrorEventBus.notify(error);
          return;
        }

        throw error;
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}
