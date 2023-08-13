import { defineStore } from "pinia";

export const useWorkoutStore = defineStore("workout", {
  state: () => ({
    workouts: [],
    exercises: [],
    comparison: "arrows",
  }),

  getters: {},

  actions: {},
});
