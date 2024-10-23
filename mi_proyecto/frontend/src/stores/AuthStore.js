import { EventEmitter } from "events";
import dispatcher from "../dispatcher/Dispatcher";
import { ACTION_TYPE } from "../constants/AppConstants";

class AuthStore extends EventEmitter {
  constructor() {
    super();
    this.isLoading = false;
    this.isLogedIn = false;
    this.showError = false;
  }

  emitChange() {
    this.emit("change");
  }

  addChangeListener(callback) {
    this.on("change", callback);
  }

  removeChangeListener(callback) {
    this.removeListener("change", callback);
  }

  handleAction(action) {
    switch (action.type) {
      case ACTION_TYPE.LOGIN:
      case ACTION_TYPE.SIGNUP:
        this.handleSubmit();
        break;
      case ACTION_TYPE.LOGIN_SUCCEEDED:
        this.handleLoginSucceeded();
        break;
      case ACTION_TYPE.LOGIN_FAILED:
        this.handleLoginFailed();
        break;
      case ACTION_TYPE.SIGNUP_SUCCEEDED:
        this.handleSignupSucceeded();
        break;
      case ACTION_TYPE.SIGNUP_FAILED:
        this.handleSignupFailed();
        break;
      case ACTION_TYPE.LOGOUT: // Nuevo caso de LOGOUT
        this.handleLogout();
        break;
      default:
    }
  }

  handleSubmit() {
    this.isLoading = true;
    this.emitChange();
  }

  handleLoginSucceeded() {
    this.isLoading = this.showError = false;
    this.isLogedIn = true;
    this.emitChange();
  }

  handleLoginFailed() {
    this.isLoading = this.isLogedIn = false;
    this.showError = true;
    this.emitChange();
  }

  handleSignupSucceeded() {
    this.isLoading = false;
    this.emitChange();
  }

  handleSignupFailed() {
    this.isLoading = this.isLogedIn = false;
    this.showError = true;
    this.emitChange();
  }

  handleLogout() {
    // Nueva función para manejar el logout
    this.isLogedIn = false;
    this.emitChange();
  }

  getIsLoading() {
    return this.isLoading;
  }

  getIsLoggedIn() {
    return this.isLogedIn;
  }

  getShowError() {
    return this.showError;
  }
}

const authStore = new AuthStore();
dispatcher.register(authStore.handleAction.bind(authStore));

export default authStore;
