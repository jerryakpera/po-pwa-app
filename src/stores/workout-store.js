import { defineStore } from "pinia";

export const useWorkoutStore = defineStore("workout", {
  state: () => ({
    workouts: [],
    exercises: [],
  }),

  getters: {},

  actions: {},
});
