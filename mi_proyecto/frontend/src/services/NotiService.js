// Clase para gestionar las notificaciones
class NotiService {
    async createNotification(message, fecha, frecuencia) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/api/notitfy_create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            sentAt: fecha,
            user: token,
            frequency: frecuencia,
          }),
        });
  
        if (!response.ok) {
          throw new Error("Error en el servidor");
        }
  
        return await response.json();
      } catch (e) {
        return null;
      }
    }

    async changeNoti(id) {
        try {
          const response = await fetch(`http://localhost:8000/api/notitfy_change/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: id,
            }),
          });
    
          return response.ok;
        } catch (e) {
          return null;
        }
      }
  
    async fetchNoti() {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:8000/api/notify_user/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: token,
              }),
            }
          );
    
          if (!response.ok) {
            throw new Error("Error en el servidor");
          }
    
          return await response.json();
        } catch (e) {
          return null;
        }
      }   
  
    
  
    
    
  }
  
  
  
  
  const notiService = new NotiService();
  
  export default notiService;