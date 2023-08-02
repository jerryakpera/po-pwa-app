import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authUser: null,
    isLoggedIn: false,
  }),

  getters: {
    doubleCount: (state) => state.counter * 2,
  },

  actions: {
    logout() {
      this.authUser = null;
      this.isLoggedIn = false;
    },

    login(user) {
      this.authUser = user;
      this.isLoggedIn = true;
    },
  },
});
