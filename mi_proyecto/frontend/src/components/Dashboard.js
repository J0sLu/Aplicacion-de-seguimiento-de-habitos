import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import authActionCreator from "../action-creators/AuthActionCreator"; // Importar acciones de autenticación
import habitsActionCreator from "../action-creators/HabitsActionCreator";
import authStore from "../stores/AuthStore";
import habitsStore from "../stores/HabitStore";
import ListGroup from "react-bootstrap/ListGroup";

const Dashboard = () => {
  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("Diario");
  const [category, setCategory] = useState("Salud");
  const [goal, setGoal] = useState("Diario");
  const [reminderTime, setReminderTime] = useState("08:00");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderMessage, setReminderMessage] = useState(""); // Nuevo estado para el mensaje
  const [habits, setHabits] = useState(habitsStore.fetchHabits());

  const navigate = useNavigate(); // Hook para redirección

  // Manejo de la creación de hábitos
  const handleHabitSubmit = (e) => {
    e.preventDefault();
    habitsActionCreator.createHabit(habitName, frequency, category, goal);
  };

  // Manejo de los recordatorios
  const handleReminderSubmit = (e) => {
    e.preventDefault();
    alert(
      `Recordatorio establecido para las ${reminderTime} con mensaje: "${reminderMessage}". Notificaciones: ${
        notificationsEnabled ? "Habilitadas" : "Deshabilitadas"
      }`
    );
  };

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

    const handleHabitsChange = () => {
      setHabits(habitsStore.getHabits());
    };

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
          return <ListGroup.Item as="li">{habit}</ListGroup.Item>;
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
            <select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            >
              <option value="Diario">Objetivo Diario</option>
              <option value="Semanal">Objetivo Semanal</option>
              <option value="Mensual">Objetivo Mensual</option>
            </select>
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
              htmlFor="notificationsEnabled"
            >
              Notificaciones
            </label>
            <input
              type="checkbox"
              id="notificationsEnabled"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
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
      {/* Botón de cerrar sesión */}
      <div
        className="logout-container"
        style={{ textAlign: "right", marginBottom: "20px" }}
      >
        <button
          className="logout-button"
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px 20px",
            backgroundColor: "#d9534f",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
