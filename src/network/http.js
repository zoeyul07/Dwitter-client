export default class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetch(url, options) {
    const res = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    try {
      const data = await res.json();
      if (res.status > 299 || res.status < 200) {
        const message =
          data && data.message ? data.message : "Something went wrong! 🤪";
        throw new Error(message);
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}
