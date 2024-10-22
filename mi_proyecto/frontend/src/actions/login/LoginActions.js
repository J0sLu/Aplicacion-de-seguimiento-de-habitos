import { ACTION_TYPE } from "../../constants/AppConstants";

export const LoginAction = {
  type: ACTION_TYPE.LOGIN,
};

export const LoginSuccededAction = {
  type: ACTION_TYPE.LOGIN_SUCCEEDED,
};

export const LoginFailedAction = {
  type: ACTION_TYPE.LOGIN_FAILED,
};

export const SignupAction = {
  type: ACTION_TYPE.SIGNUP,
};

export const SignupSuccededAction = {
  type: ACTION_TYPE.SIGNUP_SUCCEEDED,
};

export const SignupFailedAction = {
  type: ACTION_TYPE.SIGNUP_FAILED,
};

export const LogoutAction = {
  // Nueva acción para logout
  type: ACTION_TYPE.LOGOUT,
};
