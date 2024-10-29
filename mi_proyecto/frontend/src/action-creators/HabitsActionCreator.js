import dispatcher from "../dispatcher/Dispatcher";
import {
  CreateHabitAction,
  CreateHabitSuccededAction,
  CreateHabitFailedAction,
} from "../actions/habits/HabitsActions";
import habitsService from "../services/HabitsService";

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
      dispatcher.dispatch(CreateHabitSuccededAction);
    } else {
      dispatcher.dispatch(CreateHabitFailedAction);
    }
  }
}

const habitsActionCreator = new HabitsActionCreator();
export default habitsActionCreator;
