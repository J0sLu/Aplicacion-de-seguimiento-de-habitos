class AuthService {
  async login(email, password) {
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas o error en el servidor");
      }

      const data = await response.json();
      return data.exists;
    } catch (e) {
      return false;
    }
  }

  async signup(username, email, password) {
    try {
      const response = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas o error en el servidor");
      }

      return response.ok;
    } catch (e) {
      return false;
    }
  }
}

const authService = new AuthService();

export default authService;
