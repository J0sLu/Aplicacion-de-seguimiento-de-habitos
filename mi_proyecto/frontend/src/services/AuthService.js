class AuthService {
  login(username, password) {
    try {
      return this.checkCredentials(username, password);
    } catch (e) {
      console.log("Algo salio mal con el login");
    }
  }

  checkCredentials(username, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(username === "admin@gmail.com" && password === "123");
      }, 1000);
    });
  }
}

const authService = new AuthService();

export default authService;
