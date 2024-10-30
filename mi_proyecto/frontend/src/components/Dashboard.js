import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import { Navbar, Nav, Button, Dropdown, Badge } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authActionCreator from "../action-creators/AuthActionCreator"; // Importar acciones de autenticación
import habitsActionCreator from "../action-creators/HabitsActionCreator";
import authStore from "../stores/AuthStore";
import habitsStore from "../stores/HabitStore";
import ListGroup from "react-bootstrap/ListGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import Spinner from "react-bootstrap/Spinner";

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


  const handleViewProgress = () => {
    habitsActionCreator.updateProgressGrafic(selectedHabit, startDate, endDate);
  };


  const handleDeleteHabit = (id) => {
    habitsActionCreator.deleteHabit(id);
  };

  const handleUpdateProgress = (id) => {
    habitsActionCreator.updateProgress(id);
  };

  const handleReminderSubmit = (e) => {
    e.preventDefault();

    const newNotification = {
      message: `Recordatorio: ${reminderMessage}`,
      time: reminderTime,
      date: reminderDate,
      frequency: reminderFrequency,
      read: false,
    };

    setNotifications((prevNotifications) => [
      ...prevNotifications,
      newNotification,
    ]);

    toast.success(`Recordatorio creado para las ${reminderTime}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Limpiar campos de recordatorio
    setReminderMessage("");
    setReminderTime("08:00");
    setReminderDate("");
    setReminderFrequency("Unica vez");
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

    const handleHabitsChange = () => {
      setIsCreatingHabit(habitsStore.getIsCreating());
      fetchHabits();
    };

    fetchHabits();

    authStore.addChangeListener(handleAuthChange);
    habitsStore.addChangeListener(handleHabitsChange);
    return () => {
      authStore.removeChangeListener(handleAuthChange);
      habitsStore.removeChangeListener(handleHabitsChange);
    };
  }, [navigate]);

  // gráfico de progreso de hábitos
  useEffect(() => {
    const ctx = document.getElementById("habitProgressChart").getContext("2d");
  
    // Suponemos que `progressData` contiene los datos con las fechas de progreso
    // Ejemplo: [{ date: "2024-10-01", progress: 1 }, { date: "2024-10-05", progress: 1 }]
    const progressData = [
      { date: "2024-10-01", progress: 1 },
      { date: "2024-10-05", progress: 1 },
      { date: "2024-10-07", progress: 1 },
    ];
  
    // Extrae las fechas y marca el progreso como `1` para cada fecha en que se completó el hábito
    const labels = progressData.map((entry) => {
      const date = new Date(entry.date);
      return `${date.getDate()}/${date.getMonth() + 1}`; // Formato "día/mes"
    });
    const data = progressData.map((entry) => entry.progress);
  
    new Chart(ctx, {
      type: "scatter",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Días de Progreso",
            data: data,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            pointRadius: 5,
            showLine: false, // No mostrar líneas entre los puntos
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category',
            labels: labels, // Mostrar fechas como etiquetas en el eje X
          },
          y: {
            display: false, // Ocultar el eje Y si solo deseas ver los puntos
          },
        },
      },
    });
  }, []);
  
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
                  {notifications.filter((notif) => !notif.read).length}
                </Badge>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {notifications.map((notification, index) => (
                  <Dropdown.Item key={index}>
                    {notification.message}
                  </Dropdown.Item>
                ))}
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

      {/* Selección de hábito y fechas */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
        <select
          onChange={(e) => setSelectedHabit(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            marginRight: "10px",
          }}
          value={selectedHabit}
        >
          <option value="">Selecciona un Hábito</option>
          {habits.map((habit) => (
            <option key={habit.habit_id} value={habit.habit_id}>
              {habit.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            marginRight: "10px",
          }}
          value={startDate}
        />

        <input
          type="date"
          onChange={(e) => setEndDate(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
          value={endDate}
        />
      </div>

      <button
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
        onClick={handleViewProgress}
      >
        Ver Progreso
      </button>

      <canvas id="habitProgressChart" style={{ maxWidth: "100%", height: "auto" }}></canvas>
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
