import {
  LoginAction,
  LoginSuccededAction,
  LoginFailedAction,
} from "../actions/login/LoginActions";
import dispatcher from "../dispatcher/Dispatcher";

class AuthActionCreator {
  login() {
    dispatcher.dispatch(LoginAction);
    try {
      dispatcher.dispatch(LoginSuccededAction);
    } catch (e) {
      dispatcher.dispatch(LoginFailedAction);
    }
  }
}

const authActionCreator = new AuthActionCreator();
export default authActionCreator;
