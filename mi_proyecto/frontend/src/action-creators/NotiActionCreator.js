import dispatcher from "../dispatcher/Dispatcher";
import {
    CreateNotiAction,
    CreateNotiSucceededAction,
    CreateNotiFailedAction,
    ChangeNotiSucceededAction,
    ChangeNotiFailedAction,
} from "../actions/notify/NotiActions";
import notiService from "../services/NotiService";

class NotiActionCreator {
  async createNoti(message, fecha, frequency) {
      dispatcher.dispatch(CreateNotiAction);

      // Construye el objeto en el formato esperado
      const notificationData = {
          message,
          fecha,
          frequency,
      };

      const createdNotification = await notiService.createNotification(notificationData);

      if (createdNotification) {
          dispatcher.dispatch(CreateNotiSucceededAction);
      } else {
          dispatcher.dispatch(CreateNotiFailedAction);
      }
  }


  async changeNoti(id) {
    const ifUpdate = await notiService.changeNoti(id);
    if (ifUpdate) {
      dispatcher.dispatch(ChangeNotiSucceededAction);
    } else {
      dispatcher.dispatch(ChangeNotiFailedAction);
    }
  }
}

// NotiActionCreator.js
const notiActionCreator = new NotiActionCreator();
export default notiActionCreator;
