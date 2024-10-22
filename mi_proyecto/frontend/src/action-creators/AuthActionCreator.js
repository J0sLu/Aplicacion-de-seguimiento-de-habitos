import {
  LoginAction,
  LoginSuccededAction,
  LoginFailedAction,
  LogoutAction, // Importar acción de logout
} from "../actions/login/LoginActions";
import dispatcher from "../dispatcher/Dispatcher";
import authService from "../services/AuthService";

class AuthActionCreator {
  async login(username, password) {
    dispatcher.dispatch(LoginAction);
    const isLogedIn = await authService.login(username, password);
    dispatcher.dispatch(isLogedIn ? LoginSuccededAction : LoginFailedAction);
  }

  logout() { // Nueva función de logout
    dispatcher.dispatch(LogoutAction);
  }
}

const authActionCreator = new AuthActionCreator();
export default authActionCreator;

