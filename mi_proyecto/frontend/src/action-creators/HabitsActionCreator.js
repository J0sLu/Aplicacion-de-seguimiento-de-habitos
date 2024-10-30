import dispatcher from "../dispatcher/Dispatcher";
import {
  CreateHabitAction,
  CreateHabitSucceededAction,
  CreateHabitFailedAction,
  DeleteHabitSucceededAction,
  DeleteHabitFailedAction,
  UpdateProgressSucceededAction,
  UpdateProgressFailedAction,
} from "../actions/habits/HabitsActions";
import habitsService from "../services/HabitsService";

/* Clase para gestionar los hábitos */
class HabitsActionCreator {
  async createHabit(name, frequency, category, target) {
    dispatcher.dispatch(CreateHabitAction);
    const createdHabit = await habitsService.createHabit(
      name,
      frequency,
      category,
      target
    );

    if (createdHabit) {
      dispatcher.dispatch(CreateHabitSucceededAction);
    } else {
      dispatcher.dispatch(CreateHabitFailedAction);
    }
  }

  async deleteHabit(id) {
    const didDelete = await habitsService.deleteHabit(id);
    if (didDelete) {
      dispatcher.dispatch(DeleteHabitSucceededAction);
    } else {
      dispatcher.dispatch(DeleteHabitFailedAction);
    }
  }

  async updateProgress(id) {
    const didUpdate = await habitsService.updateProgress(id);
    console.log(didUpdate);
    if (didUpdate) {
      dispatcher.dispatch(UpdateProgressSucceededAction);
    } else {
      dispatcher.dispatch(UpdateProgressFailedAction);
    }
  }

  async updateProgressGrafic(habitId,startDate,endDate) {
      const data = await habitsService.fetchProgressData(habitId, startDate, endDate);
      console.log(data);
      return data; // Retorna los datos para que se puedan usar en Dashboard
  }

  
}

const habitsActionCreator = new HabitsActionCreator();
export default habitsActionCreator;
