import { EventEmitter } from "events";
import dispatcher from "../dispatcher/Dispatcher";
import { ACTION_TYPE } from "../constants/AppConstants";

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
        this.handleCreateHabitSucceded();
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
    this.habits[this.habit.length - 1] = habit;
    this.emitChange();
  }

  handleCreateHabitFailed() {
    this.habits.pop();
    this.emitChange();
  }

  fetchHabits() {
    this.habits = [
      "Resolver 3 problemas de codeforces",
      "Hacer contest con tu equipo",
      "Aprender un nuevo tema",
    ];
    return this.habits;
  }

  getHabits() {
    return this.habits;
  }
}

const habitsStore = new HabitsStore();
dispatcher.register(habitsStore.handleAction.bind(habitsStore));

export default habitsStore;
