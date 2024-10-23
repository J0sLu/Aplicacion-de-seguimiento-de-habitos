import dispatcher from "../dispatcher/Dispatcher";
import {
  CreateHabitAction,
  CreateHabitSuccededAction,
  CreateHabitFailedAction,
} from "../actions/habits/HabitsActions";
import habitsService from "../services/HabitsService";

class HabitsActionCreator {
  async createHabit(name, frequency, category, target) {
    dispatcher.dispatch(
      CreateHabitAction({ name, frequency, category, target })
    );
    const createdHabit = await habitsService.createHabit(
      name,
      frequency,
      category,
      target
    );

    console.log(createdHabit);
    if (createdHabit) {
      dispatcher.dispatch(CreateHabitSuccededAction(createdHabit));
    } else {
      dispatcher.dispatch(CreateHabitFailedAction);
    }
  }
}

const habitsActionCreator = new HabitsActionCreator();
export default habitsActionCreator;
