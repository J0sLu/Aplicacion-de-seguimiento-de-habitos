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
import  ProgressBar  from "react-bootstrap/ProgressBar";

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
  
  const navigate = useNavigate(); // Hook para redirección
  const [reminderFrequency, setReminderFrequency] = useState("Unica vez");
  const [reminderDate, setReminderDate] = useState("");

  // Manejo de la creación de hábitos
  const handleHabitSubmit = (e) => {
    e.preventDefault();
    habitsActionCreator.createHabit(habitName, frequency, category, goal);
    setHabitName("");
    setFrequency("");
    setCategory("");
    setGoal("");
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

  setNotifications((prevNotifications) => [...prevNotifications, newNotification]);

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
      setHabits(await habitsStore.getHabits());
    };

    const handleHabitsChange = () => {};

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

    new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
          "Domingo",
        ],
        datasets: [
          {
            label: "Progreso Semanal",
            data: [3, 2, 5, 4, 6, 4, 7],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
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
                  <Dropdown.Item key={index}>{notification.message}</Dropdown.Item>
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
        <ListGroup.Item as="li" active>
          Habitos
        </ListGroup.Item>
        {habits.map((habit) => {
          const progressPercentage = habit.progress * 100;
          console.log(habit);
          return <ListGroup.Item as="li">
            <div>{habit.name}</div>
            
            <div>Frecuencia: {habit.frequency}</div>
            <div>Categoría: {habit.category}</div>
            <div>Objetivo: {habit.target}</div>
            
            <ProgressBar now={progressPercentage} label={`${progressPercentage}%`} />
          </ListGroup.Item>;
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
              backgroundColor: "#701996",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
            type="submit"
          >
            Agregar Hábito
          </button>
        </form>
      </div>

      {/* Visualización del progreso */}
      <div
        className="progress-view-container"
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
          Progreso de Hábitos
        </h2>
        <canvas
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
          id="habitProgressChart"
        ></canvas>
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
      <h2 style={{ marginBottom: "15px", fontSize: "1.5rem", textAlign: "center", color: "#333" }}>
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
                backgroundColor: "#701996",
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
