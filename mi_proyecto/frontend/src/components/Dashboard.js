import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HabitDashboard.css";
import Chart from "chart.js/auto";
import authActionCreator from "../action-creators/AuthActionCreator"; // Importar acciones de autenticación
import authStore from "../stores/AuthStore";

const Dashboard = () => {
  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("Diario");
  const [category, setCategory] = useState("Salud");
  const [goal, setGoal] = useState("Diario");
  const [reminderTime, setReminderTime] = useState("08:00");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderMessage, setReminderMessage] = useState(""); // Nuevo estado para el mensaje

  const navigate = useNavigate(); // Hook para redirección

  // Manejo de la creación de hábitos
  const handleHabitSubmit = (e) => {
    e.preventDefault();
    alert(
      `Hábito "${habitName}" creado con éxito! Frecuencia: ${frequency}, Categoría: ${category}, Objetivo: ${goal}`
    );
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

    authStore.addChangeListener(handleAuthChange);
    return () => {
      authStore.removeChangeListener(handleAuthChange);
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
    <div className="container">
      {/* Botón de cerrar sesión */}
      <div className="logout-container" style={{ textAlign: "right", marginBottom: "20px" }}>
        <button className="logout-button" onClick={handleLogout} style={{
          padding: "10px 20px",
          backgroundColor: "#d9534f",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "1rem"
        }}>
          Cerrar Sesión
        </button>
      </div>

      {/* Creación de hábitos */}
      <div className="section habit-form-container">
        <h2>Crear Hábito</h2>
        <form id="habitForm" onSubmit={handleHabitSubmit}>
          <div className="input-group">
            <label htmlFor="habitName">Nombre del Hábito</label>
            <input
              type="text"
              id="habitName"
              placeholder="Ej. Leer, Meditar"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="frequency">Frecuencia</label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="Diario">Diario</option>
              <option value="Semanal">Semanal</option>
              <option value="Mensual">Mensual</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="category">Categoría</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Salud">Salud</option>
              <option value="Productividad">Productividad</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="goal">Objetivo</label>
            <select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="Diario">Objetivo Diario</option>
              <option value="Semanal">Objetivo Semanal</option>
              <option value="Mensual">Objetivo Mensual</option>
            </select>
          </div>
          <button type="submit">Agregar Hábito</button>
        </form>
      </div>

      {/* Visualización del progreso */}
      <div className="section progress-view-container">
        <h2>Progreso de Hábitos</h2>
        <canvas id="habitProgressChart"></canvas>
      </div>

      {/* Recordatorios y notificaciones */}
      <div className="section reminder-settings-container">
        <h2>Recordatorios</h2>
        <form id="reminderForm" onSubmit={handleReminderSubmit}>
          <div className="input-group">
            <label htmlFor="reminderTime">Hora del Recordatorio</label>
            <input
              type="time"
              id="reminderTime"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="reminderMessage">Mensaje del Recordatorio</label>
            <input
              type="text"
              id="reminderMessage"
              placeholder="Mensaje de recordatorio"
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="notificationsEnabled">Notificaciones</label>
            <input
              type="checkbox"
              id="notificationsEnabled"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
          </div>
          <button type="submit">Guardar Recordatorio</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;

