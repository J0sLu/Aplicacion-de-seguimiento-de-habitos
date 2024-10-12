import { EventEmitter } from "events";
import dispatcher from "../dispatcher/Dispatcher";
import { ACTION_TYPE } from "../constants/AppConstants";

/**
 * Authentication store
 */
class AuthStore extends EventEmitter {
  constructor() {
    super();
    this.isLoading = false; /* Whether the user is logging in */
    this.isLogedIn = false; /* Whether the user is already logged in */
    this.showError = false; /* Whether we should show an error message in the login */
  }

  /* Store event emmitter method */
  emitChange() {
    this.emit("change");
  }

  addChangeListener(callback) {
    this.on("change", callback);
  }

  removeChangeListener(callback) {
    this.removeListener("change", callback);
  }

  /* Store action handler method */
  handleAction(action) {
    switch (action.type) {
      case ACTION_TYPE.LOGIN:
        this.handleLogin();
        break;
      case ACTION_TYPE.LOGIN_SUCCEEDED:
        this.handleLoginSucceeded();
        break;
      case ACTION_TYPE.LOGIN_FAILED:
        this.handleLoginFailed();
        break;
      default:
    }
  }

  /* Method for handling login action */
  handleLogin() {
    this.isLoading = true;
    this.emitChange();
  }

  /* Method for handling login succeed action */
  handleLoginSucceeded() {
    this.isLoading = this.showError = false;
    this.isLogedIn = true;
    this.emitChange();
  }

  /* Method for handling login failed action */
  handleLoginFailed() {
    this.isLoading = this.isLogedIn = false;
    this.showError = true;
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
