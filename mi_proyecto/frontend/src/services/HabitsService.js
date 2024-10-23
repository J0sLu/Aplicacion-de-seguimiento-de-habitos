class HabitsService {
  async createHabit(name, frequency, category, target) {
    try {
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
          user: "4",
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

  async fetchHabits(userId) {
    try {
      console.log(`http://localhost:8000/api/habits_user/?user_id=${userId}`);
      const response = await fetch(
        `http://localhost:8000/api/habits_user/?user_id=${userId}`,
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
