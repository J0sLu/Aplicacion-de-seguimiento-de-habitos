import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart } from "react-google-charts"; 
import { Navbar, Nav, Button, Dropdown, Badge } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authActionCreator from "../action-creators/AuthActionCreator"; // Importar acciones de autenticación
import habitsActionCreator from "../action-creators/HabitsActionCreator";
import notiActionCreator from "../action-creators/NotiActionCreator";
import authStore from "../stores/AuthStore";
import habitsStore from "../stores/HabitStore";
import ListGroup from "react-bootstrap/ListGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import Spinner from "react-bootstrap/Spinner";
import notiStore from "../stores/NotiStore";
import { format } from 'date-fns'; // Importa date-fns para formatear fechas

const Dashboard = () => {
  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("Diario");
  const [category, setCategory] = useState("Salud");
  const [goal, setGoal] = useState("Diario");
  const [reminderTime, setReminderTime] = useState("08:00");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderMessage, setReminderMessage] = useState(""); // Nuevo estado para el mensaje
  const [habits, setHabits] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [progressData, setProgressData] = useState([]);



  const navigate = useNavigate(); // Hook para redirección
  const [reminderFrequency, setReminderFrequency] = useState("Unica vez");
  const [reminderDate, setReminderDate] = useState("");
  const [isCreatingHabit, setIsCreatingHabit] = useState(
    habitsStore.getIsCreating()
  );

  // Manejo de la creación de hábitos
  const handleHabitSubmit = (e) => {
    e.preventDefault();
    habitsActionCreator.createHabit(habitName, frequency, category, goal);
    setHabitName("");
    setFrequency("Diario");
    setCategory("Salud");
    setGoal("");
  };

  const processData = (data) => {
    if (!data || data.length === 0) {
      return []; // Devuelve un array vacío si no hay datos
    }
  
    const dateCountMap = {};
  
    data.forEach(item => {
      const date = item.date;
      if (dateCountMap[date]) {
        dateCountMap[date] += 1;
      } else {
        dateCountMap[date] = 1;
      }
    });
  
    return Object.entries(dateCountMap).map(([date, count]) => ({
      date,
      count,
    }));
  };
  


  const handleViewProgress = async () => {
    const data = await habitsActionCreator.updateProgressGrafic(selectedHabit, startDate, endDate);
    const processedData = processData(data);
    if (processedData.length > 0) {
      setProgressData(processedData); // Solo actualiza si hay datos procesados
    }
  };
  


  const handleDeleteHabit = (id) => {
    habitsActionCreator.deleteHabit(id);
  };

  const handleChangeNoti = async (id) => {
    await notiActionCreator.changeNoti(id); // Llama al método para actualizar en el backend
  
    // Actualiza el estado de la notificación a leída
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, is_read: true } : notification
      )
    );
  };

  const handleUpdateProgress = (id) => {
    habitsActionCreator.updateProgress(id);
  };
  
  const handleReminderSubmit = (e) => {
    e.preventDefault();
  
    // Obtén los datos necesarios del formulario
    const message = reminderMessage;
    const fecha = reminderDate + " " + reminderTime;
    const frequency = reminderFrequency;
  
    // Llama a createNoti en NotiActionCreator
    notiActionCreator.createNoti(message, fecha, frequency);
  
    // Resetea los campos del formulario después de crear la notificación
    setReminderMessage("");
    setReminderDate("");
    setReminderFrequency("Unica vez");
  
    toast.success("Recordatorio creado con éxito", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  


  const MyChart = ({ data }) => {
    const chartData = [
      [{ type: "date", label: "Fecha" }, { type: "number", label: "Veces Realizado" }],
      ...data.map(item => [new Date(item.date), item.count]), // Usa count como Y
    ];
    const options = {
      title: "Progreso de Hábito",
      hAxis: { title: "Fecha" },
      vAxis: { title: "Progreso" },
      legend: "none",
      lineWidth: 2,
      pointSize: 5,
      curveType: "function",
    };

    return (
      <Chart
        chartType="LineChart"
        data={chartData}
        options={options}
        width="100%"
        height="400px"
      />
    );
  };



  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });

      notifications.forEach((notification, index) => {
        if (
          notification.time === currentTime &&
          notificationsEnabled &&
          !notification.read
        ) {
          toast.info(`📌 ${notification.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          // Marcar como "leído" inmediatamente
          setNotifications((prevNotifications) =>
            prevNotifications.map((notif, i) =>
              i === index ? { ...notif, read: true } : notif
            )
          );
        }
      });
    }, 1000); // Revisar cada segundo

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [notifications, notificationsEnabled]);

  // Manejo de cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token"); // Borra el token del localStorage
    authActionCreator.logout();
    navigate("/login"); // Redirigir al login
  };
  

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const handleAuthChange = () => {
      if (!authStore.getIsLoggedIn()) {
        navigate("/login");
      }
    };

    const fetchHabits = async () => {
      setHabits(await habitsStore.fetchHabits());
    };

    const fetchNotifications = async () => {
      const notiData = await notiStore.fetchNoti();
      // Asegúrate de que notifications siempre sea un array
      setNotifications(Array.isArray(notiData) ? notiData : notiData.notifications || []);
    };

    const handleHabitsChange = () => {
      setIsCreatingHabit(habitsStore.getIsCreating());
      fetchHabits();
    };

    fetchHabits();
    fetchNotifications();
    authStore.addChangeListener(handleAuthChange);
    habitsStore.addChangeListener(handleHabitsChange);
    return () => {
      authStore.removeChangeListener(handleAuthChange);
      habitsStore.removeChangeListener(handleHabitsChange);
    };
  }, [navigate]);

  // gráfico de progreso de hábitos
  
  
  return (
    <>
      {/* Navbar con menú superior */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">Gestión de Hábitos</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Inicio</Nav.Link>
          </Nav>
          <Nav>
            {/* Notificaciones */}
            <Dropdown alignRight>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Notificaciones{" "}
                <Badge bg="light" text="dark">
                  {notifications.filter((notif) => !notif.is_read).length} {/* Solo cuenta las no leídas */}
                </Badge>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleChangeNoti(notification.id)} // Llama a handleChangeNoti con el ID de la notificación
                      style={{
                        backgroundColor: notification.is_read ? "#ffffff" : "#d4edda",
                        color: notification.is_read ? "#000" : "#FCE79A"
                      }}
                    >
                      <div>
                        <strong>{notification.message}</strong>
                      </div>
                      <div style={{ fontSize: "0.85em", color: "#666" }}>
                        {notification.sent_at ? format(new Date(notification.sent_at), 'dd/MM/yyyy HH:mm') : ''}
                      </div>
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item>No hay notificaciones</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <Button
              variant="outline-light"
              onClick={handleLogout}
              style={{ marginLeft: "15px" }}
            >
              Cerrar Sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Contenido principal */}
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "auto auto",
          gap: "20px",
          maxWidth: "1000px",
          width: "100%",
          padding: "20px",
        }}
      >
        {/* Lista de habitos */}
        <ListGroup as="ul">
          <ListGroup.Item as="li" active style={{
            backgroundColor: "#3A5474 ",
          }}>
            <h3>Hábitos</h3>
          </ListGroup.Item>
          {habits.map((habit) => {
            const progressPercentage = habit.progress * 100;
        
            return (
              <ListGroup.Item as="li">
                <h5>{habit.name}</h5>{" "}
                {/* Encabezado con el nombre del hábito */}
                <ProgressBar
                  now={progressPercentage}
                  label={`${progressPercentage}%`}
                  style={{ height: "20px" }}
                  variant="miColorPersonalizado"
                />

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div>Frecuencia: {habit.frequency}</div>
                  <div>Categoría: {habit.category}</div>
                  <div>Objetivo: {habit.target}</div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <button
                    className="btn  mt-2"  style={{backgroundColor: "#3A5474", color: "white"}}
                    onClick={() => handleUpdateProgress(habit.habit_id)}
                  >
                    Marcar progreso
                  </button>

                  <button
                    className="btn mt-2" style={{backgroundColor: "#938248"}}
                    onClick={() => handleDeleteHabit(habit.habit_id)} 
                  >
                    Eliminar Hábito
                  </button>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>

        {/* Creación de hábitos */}
        <div
          className="habit-form-container"
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              marginBottom: "15px",
              fontSize: "1.5rem",
              textAlign: "center",
              color: "#333",
            }}
          >
            Crear Hábito
          </h2>
          <form id="habitForm" onSubmit={handleHabitSubmit}>
            <div
              style={{
                marginBottom: "15px",
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  marginBottom: "5px",
                  display: "block",
                }}
                htmlFor="habitName"
              >
                Nombre del Hábito
              </label>
              <input
                type="text"
                id="habitName"
                placeholder="Ej. Leer, Meditar"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div
              style={{
                marginBottom: "15px",
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  marginBottom: "5px",
                  display: "block",
                }}
                htmlFor="frequency"
              >
                Frecuencia
              </label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              >
                <option value="Diario">Diario</option>
                <option value="Semanal">Semanal</option>
                <option value="Mensual">Mensual</option>
              </select>
            </div>
            <div
              style={{
                marginBottom: "15px",
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  marginBottom: "5px",
                  display: "block",
                }}
                htmlFor="category"
              >
                Categoría
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              >
                <option value="Salud">Salud</option>
                <option value="Productividad">Productividad</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <div
              style={{
                marginBottom: "15px",
                width: "100%",
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  marginBottom: "5px",
                  display: "block",
                }}
                htmlFor="goal"
              >
                Objetivo
              </label>
              <input
                type="number"
                id="goal"
                value={goal}
                min="0"
                max="100"
                onChange={(e) => setGoal(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <button
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#3A5474 ",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
              type="submit"
            >
              {isCreatingHabit ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    style={{ marginRight: "10px" }}
                  />
                  Creando...
                </>
              ) : (
                "Agregar Hábito"
              )}
            </button>
          </form>
        </div>

        {/* Visualización del progreso */}
        <div>
      <h2>Progreso de Hábitos</h2>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
        <select
          onChange={(e) => setSelectedHabit(e.target.value)}
          value={selectedHabit}
          style={{ padding: "10px", borderRadius: "5px", marginRight: "10px" }}
        >
          <option value="">Selecciona un Hábito</option>
          {habits.map(habit => (
            <option key={habit.habit_id} value={habit.habit_id}>
              {habit.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
          value={startDate}
          style={{ padding: "10px", borderRadius: "5px", marginRight: "10px" }}
        />

        <input
          type="date"
          onChange={(e) => setEndDate(e.target.value)}
          value={endDate}
          style={{ padding: "10px", borderRadius: "5px" }}
        />
      </div>

      <button
        onClick={handleViewProgress}
        style={{
          padding: "10px 20px",
          backgroundColor: "#3A5474",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "1rem",
          marginBottom: "15px",
        }}
      >
        Ver Progreso
      </button>

      <MyChart data={progressData} />
    </div>


        {/* Recordatorios y notificaciones */}
        <div
          className="reminder-settings-container"
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              marginBottom: "15px",
              fontSize: "1.5rem",
              textAlign: "center",
              color: "#333",
            }}
          >
            Recordatorios
          </h2>
          <form id="reminderForm" onSubmit={handleReminderSubmit}>
            {/* Campo de Frecuencia */}
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  marginBottom: "5px",
                  display: "block",
                }}
                htmlFor="reminderFrequency"
              >
                Frecuencia
              </label>
              <select
                id="reminderFrequency"
                value={reminderFrequency}
                onChange={(e) => setReminderFrequency(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              >
                <option value="Unica vez">Unica vez</option>
                <option value="Diario">Diario</option>
              </select>
            </div>

            {/* Campo de Fecha */}
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  marginBottom: "5px",
                  display: "block",
                }}
                htmlFor="reminderDate"
              >
                Fecha
              </label>
              <input
                type="date"
                id="reminderDate"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            {/* Campo de Hora */}
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  marginBottom: "5px",
                  display: "block",
                }}
                htmlFor="reminderTime"
              >
                Hora del Recordatorio
              </label>
              <input
                type="time"
                id="reminderTime"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            {/* Campo de Mensaje */}
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  marginBottom: "5px",
                  display: "block",
                }}
                htmlFor="reminderMessage"
              >
                Mensaje del Recordatorio
              </label>
              <input
                type="text"
                id="reminderMessage"
                placeholder="Mensaje de recordatorio"
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <button
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#3A5474 ",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
              type="submit"
            >
              Guardar Recordatorio
            </button>
          </form>
        </div>
      </div>

      {/* Contenedor para las notificaciones de toastify */}
      <ToastContainer />
    </>
  );
};

export default Dashboard;
