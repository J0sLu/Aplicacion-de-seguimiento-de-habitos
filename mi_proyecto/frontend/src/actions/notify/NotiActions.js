import { ACTION_TYPE } from "../../constants/AppConstants";

export const CreateNotiAction = {
    type: ACTION_TYPE.CREATE_NOTI,
};

export const CreateNotiSucceededAction = {
    type: ACTION_TYPE.CREATE_NOTI_SUCCEEDED,
};

export const CreateNotiFailedAction = {
    type: ACTION_TYPE.CREATE_NOTI_FAILED,
};

export const ChangeNotiAction = {
    type: ACTION_TYPE.CHANGE_NOTI,
};

export const ChangeNotiSucceededAction = {
    type: ACTION_TYPE.CHANGE_NOTI_SUCCEEDED,
};

export const ChangeNotiFailedAction = {
    type: ACTION_TYPE.CHANGE_NOTI_FAILED,
};