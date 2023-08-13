<template>
  <div style="background-color: #16161a">
    <div class="username-container full-width">
      <div class="profile-container">
        <div class="profile-img">
          <img :src="exercise.demonstration" alt="Profile Picture" />
        </div>
        <div class="profile-description">
          <div
            class="text-body1"
            :class="
              exercise.workouts.length
                ? 'cursor-pointer text-accent text-weight-bold'
                : 'text-white'
            "
            @click="openWorkouts(exercise._id)"
          >
            {{ _.capitalize(exercise.name) }}
          </div>
          <p class="username">@qusai_k09</p>
        </div>
      </div>
      <div class="menu-bar q-pr-sm">
        <q-btn
          label="w"
          color="accent"
          round
          :to="`/workouts/${exercise._id}/new`"
        />
      </div>
    </div>
    <slot name="stats" />
  </div>
</template>

<script setup>
import _ from "lodash";

const props = defineProps(["exercise"]);

const openWorkouts = (id) => {
  if (!props.exercise?.workouts?.length) return;
  router.push(`/workouts/${id}`);
};
</script>

<style lang="scss" scoped>
.username-container {
  background-color: #16161a;
  display: flex;
  // border-radius: 15px;
  padding: 0px;
  justify-content: space-between;
}

.profile-container {
  gap: 0.5em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-img {
  // border-top-left-radius: 15px;
  // border-bottom-left-radius: 15px;
  width: 85px;
  height: 85px;
  overflow: hidden;
}

.profile-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-title {
  color: white;
}

.username {
  color: #4c4c55;
}

.menu-bar {
  display: flex;
  align-items: center;
}

.menu-bar i {
  font-size: 25px;
  color: white;
}

.menu-bar i:hover {
  cursor: pointer;
}
</style>
