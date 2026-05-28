<template>
  <div
    class="status-dropdown"
    :class="{ 'is-open': isOpen }"
    tabindex="0"
    @blur="closeDropdown"
  >
    <div class="status-trigger" @click="toggleDropdown">
      <MenuStatusBadge :status="modelValue" />
      <div class="trigger-icon">
        <span class="material-symbols-outlined">expand_more</span>
      </div>
    </div>

    <Transition name="fade-slide">
      <div class="status-menu" v-if="isOpen">
        <div
          v-for="(config, key) in MENU_STATUS_CONFIG"
          :key="key"
          class="status-option"
          :class="{ 'is-active': modelValue === key }"
          @click.stop="selectStatus(key as StatusPublikasi)"
        >
          <div class="status-indicator" :class="`indicator-${key}`"></div>
          {{ config.label }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MenuStatusBadge from './MenuStatusBadge.vue'
import { type StatusPublikasi, MENU_STATUS_CONFIG } from '@/types/menu-planning'

defineProps<{
  modelValue: StatusPublikasi
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: StatusPublikasi): void
}>()

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  setTimeout(() => {
    isOpen.value = false
  }, 150)
}

const selectStatus = (status: StatusPublikasi) => {
  emit('update:modelValue', status)
  isOpen.value = false
}
</script>
