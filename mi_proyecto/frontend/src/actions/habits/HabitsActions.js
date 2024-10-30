import { ACTION_TYPE } from "../../constants/AppConstants";

/* Acciones de los hábitos */
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


export const UpdateProgressGraficSucceededAction = {
  type: ACTION_TYPE.UPDATE_PROGRESS_GRAFIC_SUCCEEDED,
};

export const UpdateProgressGraficFailedAction = {
  type: ACTION_TYPE.UPDATE_PROGRESS_GRAFIC_FAILED,
};