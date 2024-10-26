import { EventEmitter } from "events";
import dispatcher from "../dispatcher/Dispatcher";
import { ACTION_TYPE } from "../constants/AppConstants";
import habitsService from "../services/HabitsService";

class HabitsStore extends EventEmitter {
  constructor() {
    super();
    this.habits = [];
  }

  emitChange() {
    this.emit("change");
  }

  addChangeListener(callback) {
    this.on("change", callback);
  }

  removeChangeListener(callback) {
    this.removeListener("change", callback);
  }

  handleAction(action) {
    switch (action.type) {
      case ACTION_TYPE.CREATE_HABIT:
        this.handleCreateHabit(action.habit);
        break;
      case ACTION_TYPE.CREATE_HABIT_SUCCEEDED:
        this.handleCreateHabitSucceded(action.habit);
        break;
      case ACTION_TYPE.CREATE_HABIT_FAILED:
        this.handleCreateHabitFailed();
        break;
      default:
    }
  }

  handleCreateHabit(habit) {
    this.habits.push(habit);
    this.emitChange();
  }

  handleCreateHabitSucceded(habit) {
    this.habits.pop();
    this.habits.push(habit);
    this.emitChange();
  }

  handleCreateHabitFailed() {
    this.habits.pop();
    this.emitChange();
  }

  async fetchHabits() {
    this.habits = await habitsService.fetchHabits(4);
    console.log(this.habits);
    return this.habits;
  }

  async getHabits() {
    this.habits = await habitsService.fetchHabits(4);
    console.log(this.habits);
    return this.habits;
  }
}

const habitsStore = new HabitsStore();
dispatcher.register(habitsStore.handleAction.bind(habitsStore));

export default habitsStore;
