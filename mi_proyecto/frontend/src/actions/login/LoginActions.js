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
