import { api } from "src/boot/axios";

export const loadExercise = async (exerciseId) => {
  try {
    const { data } = await api.get(`/exercises/${exerciseId}/`);
    const { exercise } = data;

    return exercise;
  } catch (e) {
    console.log(e);
  }
};

export const loadUsersExercise = async (exerciseId, uid) => {
  try {
    const { data } = await api.get(`/exercises/${exerciseId}/${uid}`);
    const { exercise } = data;

    return exercise;
  } catch (e) {
    console.log(e);
  }
};

export const fetchUsersExerciseWorkouts = async (exerciseId, uid) => {
  try {
    const { data } = await api.get(`/workouts/${exerciseId}/${uid}`);
    const { exercise } = data;

    return exercise;
  } catch (e) {
    console.log(e);
  }
};

export const loadAllExercises = async (q) => {
  try {
    const queryParams = new URLSearchParams({
      q,
    });

    const url = q ? `/exercises/all?${queryParams}` : "/exercises/all";

    const { data } = await api.get(url);
    const { exercises } = data;

    return exercises;
  } catch (e) {
    console.log(e);
  }
};

export const loadWorkouts = async () => {
  try {
    const { data } = await api.get("/workouts");
    const { workouts } = data;

    return workouts;
  } catch (e) {
    console.log(e);
  }
};

export const getUsersWorkouts = async (uid) => {
  try {
    const { data } = await api.get(`/workouts/${uid}`);
    const { exercises } = data;

    return exercises;
  } catch (e) {
    console.log(e);
  }
};

export const createWorkout = async (payload) => {
  try {
    await api.post("/workouts", payload);
  } catch (e) {
    console.log(e);
  }
};

export const deleteWorkout = async (workoutId) => {
  try {
    await api.delete(`/workouts/${workoutId}`);
  } catch (e) {
    throw e;
  }
};
