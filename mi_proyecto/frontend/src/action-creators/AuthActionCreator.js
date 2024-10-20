import {
  LoginAction,
  LoginSuccededAction,
  LoginFailedAction,
} from "../actions/login/LoginActions";
import dispatcher from "../dispatcher/Dispatcher";
import authService from "../services/AuthService";

class AuthActionCreator {
  async login(username, password) {
    dispatcher.dispatch(LoginAction);
    const isLogedIn = await authService.login(username, password);
    dispatcher.dispatch(isLogedIn ? LoginSuccededAction : LoginFailedAction);
  }
}

const authActionCreator = new AuthActionCreator();
export default authActionCreator;
