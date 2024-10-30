import { EventEmitter } from "events";
import dispatcher from "../dispatcher/Dispatcher";
import { ACTION_TYPE } from "../constants/AppConstants";
import notiService from "../services/NotiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


class NotiStore extends EventEmitter {
    constructor() {
      super();
      this.notifys = [];
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
        case ACTION_TYPE.CREATE_NOTI:
            this.handleCreateNoti();
            break;
        case ACTION_TYPE.CREATE_NOTI_SUCCEEDED:
            this.handleCreateNotiSucceeded();
            break;
        case ACTION_TYPE.CREATE_NOTI_FAILED:
            this.handleCreateNotiFailed();
            break;
        default:
      }
    }
  
    handleCreateNotit() {
      this.isCreating = true;
      this.emitChange();
    }
  
    handleCreateNotiSucceeded() {
      toast.success("Recordatorio creado exitosamente");
      this.isCreating = false;
      this.emitChange();
    }
  
    handleCreateNotiFailed() {
      toast.error(
        "Algo salio mal creando el recordatorio, intenta de nuevo."
      );
      this.isCreating = false;
      this.emitChange();
    }

    handleChangeNoti() {
        this.isCreating = true;
        this.emitChange();
    }

    handleChangeNotiSucceeded() {
        this.isCreating = false;
        this.emitChange();
    }

    handleChangeNotiFailed() {
        this.isCreating = false;
        this.emitChange();
    }


    async fetchNoti() {
        this.habits = await notiService.fetchNoti();
        return this.habits;
      }
  
    
  }
  
  const notiStore = new NotiStore();
  dispatcher.register(notiStore.handleAction.bind(notiStore));
  
  export default notiStore;
  