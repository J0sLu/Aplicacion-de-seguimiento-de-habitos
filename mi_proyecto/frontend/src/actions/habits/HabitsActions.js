import { ACTION_TYPE } from "../../constants/AppConstants";

export const CreateHabitAction = {
  type: ACTION_TYPE.CREATE_HABIT,
};

export const CreateHabitSucceededAction = {
  type: ACTION_TYPE.CREATE_HABIT_SUCCEEDED,
};

export const CreateHabitFailedAction = {
  type: ACTION_TYPE.CREATE_HABIT_FAILED,
};

export const DeleteHabitSucceededAction = {
  type: ACTION_TYPE.DELETE_HABIT_SUCCEEDED,
};

export const DeleteHabitFailedAction = {
  type: ACTION_TYPE.DELETE_HABIT_FAILED,
};

export const UpdateProgressSucceededAction = {
  type: ACTION_TYPE.UPDATE_PROGRESS_SUCCEEDED,
};

export const UpdateProgressFailedAction = {
  type: ACTION_TYPE.UPDATE_PROGRESS_FAILED,
};
