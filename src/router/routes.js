const routes = [
  {
    path: "/",
    meta: {
      requiresAuth: true,
    },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "exercises", component: () => import("pages/ExercisesPage.vue") },
      {
        path: "workouts/:exerciseId/new",
        props: true,
        component: () => import("pages/NewWorkout.vue"),
      },
      {
        path: "workouts/:exerciseId",
        props: true,
        component: () => import("pages/WorkoutsPage.vue"),
      },
    ],
  },

  {
    path: "/landing",
    component: () => import("layouts/SplashLayout.vue"),
    meta: {
      isGuest: true,
    },
    children: [
      { path: "", component: () => import("pages/landing/SplashPage.vue") },
      { path: "login", component: () => import("pages/landing/Login.vue") },
      { path: "sign-up", component: () => import("pages/landing/SignUp.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
