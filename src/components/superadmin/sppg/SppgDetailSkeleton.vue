<template>
  <div>
    <!-- ═══ SKELETON: Initial Full-Page Loading ═══ -->
    <div v-if="type === 'initial'" class="skeleton-wrapper">
      <!-- Skeleton Tabs Header -->
      <div class="skeleton-tabs-header">
        <div v-for="i in 3" :key="i" class="skeleton-tab">
          <div class="skeleton-tab__icon skeleton-shimmer" />
          <div class="skeleton-tab__label skeleton-shimmer" />
        </div>
      </div>

      <!-- Skeleton Tab Body -->
      <div class="skeleton-body">
        <!-- Row 1: Hero Info Cards -->
        <div class="skeleton-info-row">
          <div v-for="i in 3" :key="i" class="skeleton-info-card">
            <div class="skeleton-info-card__icon skeleton-shimmer" />
            <div class="skeleton-info-card__lines">
              <div class="skeleton-line skeleton-shimmer" style="width: 55%;" />
              <div class="skeleton-line skeleton-shimmer" style="width: 80%;" />
            </div>
          </div>
        </div>

        <!-- Row 2: Detail Fields Grid -->
        <div class="skeleton-fields-grid">
          <div v-for="i in 8" :key="i" class="skeleton-field">
            <div class="skeleton-field__label skeleton-shimmer" />
            <div class="skeleton-field__value skeleton-shimmer" />
          </div>
        </div>

        <!-- Row 3: Capacity Bar -->
        <div class="skeleton-capacity-section">
          <div class="skeleton-line skeleton-shimmer" style="width: 160px; height: 16px; margin-bottom: 12px;" />
          <div class="skeleton-capacity-bar skeleton-shimmer" />
          <div class="skeleton-capacity-chips">
            <div v-for="i in 3" :key="i" class="skeleton-chip skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ SKELETON: Partners Tab Loading ═══ -->
    <div v-else-if="type === 'partners'" class="skeleton-body">
      <div class="skeleton-table">
        <div class="skeleton-table__header">
          <div v-for="i in 5" :key="i" class="skeleton-table__th skeleton-shimmer" />
        </div>
        <div v-for="r in 5" :key="r" class="skeleton-table__row">
          <div v-for="c in 5" :key="c" class="skeleton-table__td skeleton-shimmer" />
        </div>
      </div>
    </div>

    <!-- ═══ SKELETON: Menus Tab Loading ═══ -->
    <div v-else-if="type === 'menus'" class="skeleton-body">
      <div class="skeleton-menu-periods">
        <div v-for="i in 2" :key="i" class="skeleton-menu-card">
          <div class="skeleton-menu-card__header">
            <div class="skeleton-line skeleton-shimmer" style="width: 180px; height: 18px;" />
            <div class="skeleton-line skeleton-shimmer" style="width: 90px; height: 24px; border-radius: 12px;" />
          </div>
          <div class="skeleton-menu-card__body">
            <div v-for="j in 4" :key="j" class="skeleton-line skeleton-shimmer" style="height: 36px;" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'initial' | 'partners' | 'menus'
}>()
</script>

<style scoped lang="scss">
// Shimmer styles
.skeleton-shimmer {
  background: linear-gradient(90deg, $color-bg-subtle 25%, $color-border-light 50%, $color-bg-subtle 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: $radius-sm;
}

// Skeleton Wrapper
.skeleton-wrapper {
  min-height: 400px;
}

// Skeleton Tabs (mimics the real tab header)
.skeleton-tabs-header {
  display: flex;
  gap: $space-2;
  padding: $space-3 $space-4;
  border-bottom: 1px solid $color-border;
  background: $color-bg-subtle;
}

.skeleton-tab {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3 $space-5;
}

.skeleton-tab__icon {
  width: 20px;
  height: 20px;
  border-radius: $radius-sm;
}

.skeleton-tab__label {
  width: 90px;
  height: 14px;
}

// Skeleton Body
.skeleton-body {
  padding: $space-6;
}

// Info cards row
.skeleton-info-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $space-4;
  margin-bottom: $space-6;
}

.skeleton-info-card {
  display: flex;
  align-items: flex-start;
  gap: $space-4;
  padding: $space-5;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  background: $color-bg-subtle;
}

.skeleton-info-card__icon {
  width: 44px;
  height: 44px;
  border-radius: $radius-md;
  flex-shrink: 0;
}

.skeleton-info-card__lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $space-2;
  padding-top: 4px;
}

.skeleton-line {
  height: 12px;
  border-radius: $radius-sm;
  width: 100%;
}

// Detail fields grid
.skeleton-fields-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-4 $space-5;
  margin-bottom: $space-6;
}

.skeleton-field {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.skeleton-field__label {
  width: 70%;
  height: 11px;
}

.skeleton-field__value {
  width: 100%;
  height: 16px;
}

// Capacity section
.skeleton-capacity-section {
  padding-top: $space-5;
  border-top: 1px solid $color-border;
}

.skeleton-capacity-bar {
  height: 12px;
  border-radius: 6px;
  margin-bottom: $space-4;
}

.skeleton-capacity-chips {
  display: flex;
  gap: $space-3;
}

.skeleton-chip {
  width: 110px;
  height: 28px;
  border-radius: 14px;
}

// Table skeleton (partners tab)
.skeleton-table {
  border: 1px solid $color-border;
  border-radius: $radius-md;
  overflow: hidden;
}

.skeleton-table__header {
  display: flex;
  gap: $space-3;
  padding: $space-4 $space-5;
  background: $color-bg-subtle;
  border-bottom: 1px solid $color-border;
}

.skeleton-table__th {
  flex: 1;
  height: 14px;
}

.skeleton-table__row {
  display: flex;
  gap: $space-3;
  padding: $space-4 $space-5;
  border-bottom: 1px solid $color-border;

  &:last-child {
    border-bottom: none;
  }
}

.skeleton-table__td {
  flex: 1;
  height: 16px;
}

// Menu periods skeleton (menus tab)
.skeleton-menu-periods {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.skeleton-menu-card {
  border: 1px solid $color-border;
  border-radius: $radius-md;
  overflow: hidden;
}

.skeleton-menu-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-4 $space-5;
  background: $color-bg-subtle;
  border-bottom: 1px solid $color-border;
}

.skeleton-menu-card__body {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  padding: $space-5;
}

// Shimmer Keyframes
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
