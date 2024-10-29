import { EventEmitter } from "events";
import dispatcher from "../dispatcher/Dispatcher";
import { ACTION_TYPE } from "../constants/AppConstants";
import habitsService from "../services/HabitsService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class HabitsStore extends EventEmitter {
  constructor() {
    super();
    this.habits = [];
    this.isCreating = false;
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
        this.handleCreateHabit();
        break;
      case ACTION_TYPE.CREATE_HABIT_SUCCEEDED:
        this.handleCreateHabitSucceeded();
        break;
      case ACTION_TYPE.CREATE_HABIT_FAILED:
        this.handleCreateHabitFailed();
        break;
      case ACTION_TYPE.DELETE_HABIT_SUCCEEDED:
        this.handleDeleteHabitSucceeded();
        break;
      case ACTION_TYPE.DELETE_HABIT_FAILED:
        this.handleDeleteHabitFailed();
        break;
      case ACTION_TYPE.UPDATE_PROGRESS_SUCCEEDED:
        this.handleUpdateProgressSucceeded();
        break;
      case ACTION_TYPE.UPDATE_PROGRESS_FAILED:
        this.handleUpdateProgressFailed();
        break;
      default:
    }
  }

  handleCreateHabit() {
    this.isCreating = true;
    this.emitChange();
  }

  handleCreateHabitSucceeded() {
    toast.success("Hábito creado exitosamente");
    this.isCreating = false;
    this.emitChange();
  }

  handleCreateHabitFailed() {
    toast.error(
      "Algo salio mal creando el habito, intenta de nuevo sin repetir el nombre"
    );
    this.isCreating = false;
    this.emitChange();
  }

  handleDeleteHabitSucceeded() {
    toast.success("Hábito eliminado exitosamente");
    this.emitChange();
  }

  handleDeleteHabitFailed() {
    toast.error("Algo salio mal eliminando el habito, intenta de nuevo");
    this.emitChange();
  }

  handleUpdateProgressSucceeded() {
    toast.success("Progreso actualizado exitosamente");
    this.emitChange();
  }

  handleUpdateprogressFailed() {
    toast.error("Algo salio mal actualizando el progreso, intenta de nuevo");
    this.emitChange();
  }

  async fetchHabits() {
    this.habits = await habitsService.fetchHabits();
    return this.habits;
  }

  getIsCreating() {
    return this.isCreating;
  }
}

const habitsStore = new HabitsStore();
dispatcher.register(habitsStore.handleAction.bind(habitsStore));

export default habitsStore;
