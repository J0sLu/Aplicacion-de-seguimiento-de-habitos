class HabitsService {
  async createHabit(name, frequency, category, target) {
    try {
      const userId = localStorage.getItem("id");
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
          user: userId,
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
      const userId = localStorage.getItem("id");
      const response = await fetch(
        `http://localhost:8000/api/progress_habit/?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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

const habitsService = new HabitsService();

export default habitsService;
