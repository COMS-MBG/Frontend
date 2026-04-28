<script setup lang="ts"></script>

<template>
  <router-view />
</template>

<!-- style tanpa "scoped" agar berlaku global ke seluruh halaman -->
<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#app {
  height: 100%;
}
</style>
