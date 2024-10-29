import {
  LoginAction,
  LoginSuccededAction,
  LoginFailedAction,
  SignupAction,
  SignupSuccededAction,
  SignupFailedAction,
  LogoutAction, // Importar acción de logout
} from "../actions/login/LoginActions";
import dispatcher from "../dispatcher/Dispatcher";
import authService from "../services/AuthService";

class AuthActionCreator {
  async login(username, password) {
    dispatcher.dispatch(LoginAction);
    const response = await authService.login(username, password);
    if (response.exists) {
      localStorage.setItem("user", response.username);
      localStorage.setItem("token", response.token);
      dispatcher.dispatch(LoginSuccededAction);
    } else {
      dispatcher.dispatch(LoginFailedAction);
    }
  }

  async signup(username, email, password) {
    dispatcher.dispatch(SignupAction);
    const isSaved = await authService.signup(username, email, password);
    dispatcher.dispatch(isSaved ? SignupSuccededAction : SignupFailedAction);
  }

  logout() {
    // Nueva función de logout
    dispatcher.dispatch(LogoutAction);
  }
}

const authActionCreator = new AuthActionCreator();
export default authActionCreator;
