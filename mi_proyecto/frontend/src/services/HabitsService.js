class HabitsService {
  async createHabit(name, frequency, category, target) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/create_habit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          frequency: frequency,
          category: category,
          target: target,
          user: token,
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

  async fetchHabits() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/progress_habit/`,
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

  async deleteHabit(id) {
    try {
      const response = await fetch(`http://localhost:8000/api/habit_erase/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          habit_id: id,
        }),
      });

      return response.ok;
    } catch (e) {
      return null;
    }
  }

  async updateProgress(id) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/progress_create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            habit: id,
          }),
        }
      );

      return response.ok;
    } catch (e) {
      return null;
    }
  }
}

const habitsService = new HabitsService();

export default habitsService;
