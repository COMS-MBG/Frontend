<template>
  <div class="base-table-skeleton">
    <table class="base-table-skeleton__table">
      <thead v-if="headers.length > 0">
        <tr>
          <th v-for="(h, i) in headers" :key="i" :class="h.align ? `th-${h.align}` : ''">
            {{ h.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r" class="skeleton-row">
          <td v-for="(col, ci) in columns" :key="ci" :style="{ textAlign: col.align || 'left' }">
            <div v-if="col.type === 'avatar-text'" class="skeleton-cell-avatar" :style="{ justifyContent: col.align === 'center' ? 'center' : col.align === 'right' ? 'flex-end' : 'flex-start' }">
              <div class="skeleton-circle" />
              <div class="skeleton-text-group">
                <div class="skeleton-bar skeleton-bar--name" />
                <div class="skeleton-bar skeleton-bar--sub" />
              </div>
            </div>
            <div v-else-if="col.type === 'badge'" class="skeleton-bar skeleton-bar--badge" :style="{ margin: col.align === 'center' ? '0 auto' : col.align === 'right' ? '0 0 0 auto' : '0' }" />
            <div v-else-if="col.type === 'actions'" class="skeleton-action-group" :style="{ justifyContent: col.align === 'center' ? 'center' : col.align === 'right' ? 'flex-end' : 'flex-start' }">
              <div class="skeleton-circle skeleton-circle--sm" />
              <div class="skeleton-circle skeleton-circle--sm" />
            </div>
            <div v-else class="skeleton-bar skeleton-bar--default" :style="{ maxWidth: col.width || '64px', width: '100%', margin: col.align === 'center' ? '0 auto' : col.align === 'right' ? '0 0 0 auto' : '0' }" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
export interface SkeletonColumn {
  type?: 'text' | 'avatar-text' | 'badge' | 'actions'
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface SkeletonHeader {
  label: string
  align?: 'left' | 'center' | 'right'
}

withDefaults(defineProps<{
  rows?: number
  columns?: SkeletonColumn[]
  headers?: SkeletonHeader[]
}>(), {
  rows: 6,
  columns: () => [
    { type: 'avatar-text' },
    { type: 'badge' },
    { type: 'text', width: '56px' },
    { type: 'text', width: '64px' },
    { type: 'text', width: '64px' },
    { type: 'text', width: '64px' },
    { type: 'text', width: '64px' },
    { type: 'actions' },
  ],
  headers: () => [],
})
</script>

<style scoped lang="scss">
.base-table-skeleton {
  @include card-base($radius-lg, $shadow-xs);
  overflow: hidden;
}

.base-table-skeleton__table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-family: $font-body;

  thead {
    tr {
      background-color: $color-bg-subtle;
      border-bottom: 1px solid $color-border;
    }

    th {
      padding: $space-3 $space-5;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $color-text-muted;
      white-space: nowrap;
      text-align: left;
    }

    .th-center { text-align: center; }
    .th-right { text-align: right; }
  }
}

.skeleton-row {
  border-bottom: 1px solid $color-border-light;

  td {
    padding: $space-4 $space-3;
    vertical-align: middle;
  }
}

// ── Shimmer animation ──
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-bar {
  height: 12px;
  border-radius: $radius-sm;
  background: linear-gradient(90deg, $color-bg-subtle 25%, $color-border-light 50%, $color-bg-subtle 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;

  &--name { width: 100%; max-width: 140px; height: 14px; }
  &--sub { width: 60%; max-width: 80px; height: 10px; margin-top: 4px; }
  &--badge { width: 48px; height: 22px; border-radius: 6px; }
}

.skeleton-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(90deg, $color-bg-subtle 25%, $color-border-light 50%, $color-bg-subtle 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  flex-shrink: 0;

  &--sm {
    width: 28px;
    height: 28px;
  }
}

.skeleton-cell-avatar {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.skeleton-text-group {
  display: flex;
  flex-direction: column;
}

.skeleton-action-group {
  display: flex;
  justify-content: center;
  gap: $space-2;
}
</style>
