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
    if (didUpdate) {
      dispatcher.dispatch(UpdateProgressSucceededAction);
    } else {
      dispatcher.dispatch(UpdateProgressFailedAction);
    }
  }
}

const habitsActionCreator = new HabitsActionCreator();
export default habitsActionCreator;
