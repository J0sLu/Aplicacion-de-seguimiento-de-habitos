import { ACTION_TYPE } from "../../constants/AppConstants";

export const CreateHabitAction = {
  type: ACTION_TYPE.CREATE_HABIT,
};

export const CreateHabitSuccededAction = {
  type: ACTION_TYPE.CREATE_HABIT_SUCCEEDED,
};

export const CreateHabitFailedAction = {
  type: ACTION_TYPE.CREATE_HABIT_FAILED,
};
