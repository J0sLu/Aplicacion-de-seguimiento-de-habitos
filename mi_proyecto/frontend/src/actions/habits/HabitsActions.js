import { ACTION_TYPE } from "../../constants/AppConstants";

export const CreateHabitAction = (habit) => ({
  type: ACTION_TYPE.CREATE_HABIT,
  habit,
});

export const CreateHabitSuccededAction = (habit) => ({
  type: ACTION_TYPE.CREATE_HABIT_SUCCEEDED,
  habit,
});

export const CreateHabitFailedAction = {
  type: ACTION_TYPE.CREATE_HABIT_FAILED,
};
