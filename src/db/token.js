const TOKEN = "token";

//브라우저 스토리지에 저장하는것은 안전하지 않음
export default class TokenStorage {
  saveToken(token) {
    localStorage.setItem(TOKEN, token);
  }

  getToken() {
    return localStorage.getItem(TOKEN);
  }

  clearToken() {
    localStorage.clear(TOKEN);
  }
}
