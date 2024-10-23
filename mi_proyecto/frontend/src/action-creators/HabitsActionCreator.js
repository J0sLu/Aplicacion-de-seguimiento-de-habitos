import dispatcher from "../dispatcher/Dispatcher";
import {
  CreateHabitAction,
  CreateHabitSuccededAction,
  CreateHabitFailedAction,
} from "../actions/habits/HabitsActions";
import habitsService from "../services/HabitsService";

class HabitsActionCreator {
  async createHabit(habitName, frequency, category, goal) {
    dispatcher.dispatch(CreateHabitAction);
    const createdHabit = await habitsService.createHabit(
      habitName,
      frequency,
      category,
      goal
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
