import { useAuthStore } from "stores/auth-store";
import { getCurrentUser } from "src/config/firebase.config";

export const routerGuard = async (to, from, next) => {
  const authStore = useAuthStore();
  const currentUser = await getCurrentUser();

  if (currentUser) {
    authStore.authUser = currentUser;
  }

  if (to.meta.requiresAuth && !currentUser) {
    return next("/landing");
  }

  if (to.meta.isGuest && currentUser) {
    return next("/");
  }

  return next();
};
