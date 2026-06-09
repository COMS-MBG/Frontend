<template>
  <div class="sa-dashboard-card capacity-widget-card">
    <div class="capacity-widget-card__header">
      <div class="header-title">
        <span class="material-symbols-outlined header-icon">warning</span>
        <h3>Beban Dapur & Kapasitas SPPG</h3>
      </div>
      <span class="badge badge--danger" v-if="overloadedSppgs.length > 0">{{ overloadedSppgs.length }} Overload</span>
      <span class="badge badge--success" v-else>Normal</span>
    </div>

    <div class="capacity-widget-card__body">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="skeleton-list">
        <div v-for="i in 3" :key="i" class="skeleton-item">
          <div class="skeleton-line skeleton-shimmer w-40"></div>
          <div class="skeleton-line skeleton-shimmer w-80"></div>
        </div>
      </div>

      <!-- Empty/Success State: All SPPGs are normal -->
      <div v-else-if="overloadedSppgs.length === 0" class="capacity-success-state">
        <span class="material-symbols-outlined success-icon">check_circle</span>
        <div class="success-text">
          <h4>Kapasitas Nasional Aman</h4>
          <p>Seluruh dapur operasional berada di bawah batas beban kapasitas 80%.</p>
        </div>
      </div>

      <!-- Alert Feed of Overloaded SPPGs -->
      <div v-else class="overloaded-list">
        <div 
          v-for="sppg in overloadedSppgs" 
          :key="sppg.id" 
          class="overloaded-item"
          :class="`is-${sppg.loadStatus}`"
        >
          <!-- Row 1: Title, City, and Status Badge -->
          <div class="item-header">
            <div class="sppg-info">
              <span class="sppg-name">{{ sppg.name }}</span>
              <span class="sppg-city">
                <span class="material-symbols-outlined icon-city">location_on</span>
                {{ sppg.region?.city || sppg.city || '—' }}
              </span>
            </div>
            <span class="load-badge" :class="`load-badge--${sppg.loadStatus}`">
              {{ sppg.loadStatus === 'critical' ? 'Kritis' : 'Penuh' }}
            </span>
          </div>

          <!-- Row 2: Progress Bar -->
          <div class="item-progress">
            <div class="progress-bar-track">
              <div 
                class="progress-bar-fill" 
                :class="`fill-${sppg.loadStatus}`"
                :style="{ width: `${sppg.percentage}%` }"
              ></div>
            </div>
          </div>

          <!-- Row 3: Descriptive Details & Action Link -->
          <div class="item-meta">
            <div class="load-details">
              <span class="metric-highlight">{{ sppg.total_portions?.toLocaleString('id-ID') || 0 }}</span>
              <span class="metric-label"> porsi terdistribusi (Beban: {{ sppg.total_partners || 0 }} / {{ sppg.capacity }} Sekolah Mitra)</span>
            </div>
            
            <RouterLink 
              :to="{ name: 'super-admin-sppg-detail', params: { id: sppg.id } }" 
              class="mitigation-link"
            >
              <span>Detail Mitigasi</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SppgItem } from '@/types/superadmin-sppg'

const props = defineProps<{
  sppgs: SppgItem[]
  isLoading: boolean
}>()

// Filter SPPGs to show only warnings (>=80%) and critical (>=95%)
interface OverloadedSppg extends SppgItem {
  percentage: number
  loadStatus: 'warning' | 'critical'
}

const overloadedSppgs = computed<OverloadedSppg[]>(() => {
  const result: OverloadedSppg[] = []
  
  props.sppgs.forEach(s => {
    if (s.status !== 'active') return

    const currentPartners = s.total_partners || 0
    const maxSchools = s.capacity || 1
    const percentage = Math.round((currentPartners / maxSchools) * 100)

    if (percentage >= 80) {
      result.push({
        ...s,
        percentage: Math.min(percentage, 100),
        loadStatus: percentage >= 95 ? 'critical' : 'warning'
      })
    }
  })

  // Sort by highest load percentage first
  return result.sort((a, b) => b.percentage - a.percentage)
})
</script>

<style scoped lang="scss">
.capacity-widget-card {
  display: flex;
  flex-direction: column;
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  overflow: hidden;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-4 $space-5;
    background: $color-bg-subtle;
    border-bottom: 1px solid $color-border;

    .header-title {
      display: flex;
      align-items: center;
      gap: $space-2;

      .header-icon {
        color: $color-primary;
        font-size: 1.25rem;
      }

      h3 {
        margin: 0;
        font-size: $text-sm;
        font-weight: 700;
        color: $color-text-primary;
      }
    }

    .badge {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: $radius-sm;
      font-weight: 600;

      &--success {
        background: rgba($color-success, 0.1);
        color: $color-success-dark;
        border: 1px solid rgba($color-success, 0.2);
      }

      &--danger {
        background: rgba($color-danger, 0.1);
        color: $color-danger-darker;
        border: 1px solid rgba($color-danger, 0.2);
      }
    }
  }

  &__body {
    padding: $space-5;
    flex-grow: 1;
    overflow-y: auto;
  }
}

.capacity-success-state {
  display: flex;
  align-items: center;
  gap: $space-4;
  padding: $space-4 $space-2;

  .success-icon {
    font-size: 2.25rem;
    color: $color-success;
  }

  .success-text {
    h4 {
      margin: 0 0 2px 0;
      font-size: $text-sm;
      font-weight: 700;
      color: $color-text-primary;
    }
    p {
      margin: 0;
      font-size: $text-xs;
      color: $color-text-muted;
      line-height: 1.4;
    }
  }
}

.overloaded-list {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.overloaded-item {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  padding: $space-4 $space-5;
  background: $color-bg-page;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  border-left: 4px solid transparent;
  transition: all $transition-base;

  &:hover {
    background: $color-bg-surface;
    border-color: $color-primary-muted;
    box-shadow: $shadow-sm;
    transform: translateY(-1px);
  }

  &.is-warning {
    border-left-color: $color-warning;
    background: rgba($color-warning, 0.02);
  }

  &.is-critical {
    border-left-color: $color-danger;
    background: rgba($color-danger, 0.01);
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $space-3;
}

.sppg-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  .sppg-name {
    font-size: $text-sm;
    font-weight: 700;
    color: $color-text-primary;
    line-height: 1.2;
    word-break: break-word;
  }

  .sppg-city {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 11px;
    color: $color-text-muted;

    .icon-city {
      font-size: 13px;
      color: $color-text-faint;
    }
  }
}

.load-badge {
  font-size: 9px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: $radius-pill;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;

  &--warning {
    background: rgba($color-warning, 0.15);
    color: $color-warning-dark;
    border: 1px solid rgba($color-warning, 0.25);
  }

  &--critical {
    background: rgba($color-danger, 0.12);
    color: $color-danger-dark;
    border: 1px solid rgba($color-danger, 0.2);
  }
}

.item-progress {
  width: 100%;

  .progress-bar-track {
    width: 100%;
    height: 8px;
    background: $color-bg-muted;
    border-radius: $radius-pill;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    border-radius: $radius-pill;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);

    &.fill-warning {
      background: linear-gradient(90deg, $color-warning, #f59e0b);
    }

    &.fill-critical {
      background: linear-gradient(90deg, $color-danger, $color-danger-dark);
    }
  }
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  gap: $space-3;
}

.load-details {
  color: $color-text-secondary;
  line-height: 1.3;

  .metric-highlight {
    font-weight: 700;
    color: $color-text-primary;
  }

  .metric-label {
    color: $color-text-muted;
  }
}

.mitigation-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  color: $color-primary;
  text-decoration: none;
  transition: all $transition-fast;
  white-space: nowrap;

  .material-symbols-outlined {
    font-size: 14px;
    transition: transform $transition-fast;
  }

  &:hover {
    color: $color-primary-dark;

    .material-symbols-outlined {
      transform: translateX(3px);
    }
  }
}

// Skeleton loading styles
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.skeleton-item {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  padding: $space-4;
  background: $color-bg-subtle;
  border-radius: $radius-md;
}

.skeleton-line {
  height: 12px;
  border-radius: $radius-sm;

  &.w-40 { width: 40%; }
  &.w-80 { width: 80%; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-shimmer {
  background: linear-gradient(90deg, $color-bg-subtle 25%, $color-border-light 50%, $color-bg-subtle 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
</style>
