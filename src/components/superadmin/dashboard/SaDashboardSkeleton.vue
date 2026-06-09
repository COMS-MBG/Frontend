<template>
  <div class="sa-dashboard-grid">
    <!-- Row 1: KPI Stats Cards Skeleton (4 Cards) -->
    <div class="sa-dashboard-stats-skeleton">
      <div v-for="i in 4" :key="i" class="kpi-card-skeleton">
        <div class="kpi-card-skeleton__top">
          <div class="skeleton-shimmer icon-skeleton" />
          <div class="label-value-skeleton">
            <div class="skeleton-shimmer text-line w-40" />
            <div class="skeleton-shimmer text-line w-60" />
          </div>
        </div>
        <div class="kpi-card-skeleton__bottom">
          <div class="skeleton-shimmer text-line w-80" />
        </div>
      </div>
    </div>

    <!-- Row 2: Hero Section (Map & Capacity Alert) -->
    <div class="sa-dashboard-grid__row-main">
      <!-- Map Widget Skeleton -->
      <div class="grid-col-2-3">
        <div class="sa-dashboard-card map-widget-card-skeleton">
          <div class="widget-header-skeleton">
            <div class="skeleton-shimmer header-title-skeleton" />
            <div class="skeleton-shimmer header-meta-skeleton" />
          </div>
          <div class="widget-body-skeleton skeleton-shimmer" />
        </div>
      </div>
      <!-- Capacity Widget Skeleton -->
      <div class="grid-col-1-3">
        <div class="sa-dashboard-card capacity-widget-card-skeleton">
          <div class="widget-header-skeleton">
            <div class="skeleton-shimmer header-title-skeleton" />
            <div class="skeleton-shimmer header-meta-skeleton" />
          </div>
          <div class="widget-body-skeleton">
            <div v-for="i in 3" :key="i" class="capacity-item-skeleton">
              <div class="skeleton-shimmer text-line w-40" />
              <div class="skeleton-shimmer progress-bar-skeleton" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 3: Actionable Insights (Finance & Quick Actions) -->
    <div class="sa-dashboard-grid__row-bottom">
      <!-- Finance Widget Skeleton -->
      <div class="grid-col-1-2">
        <div class="sa-dashboard-card finance-widget-card-skeleton">
          <div class="widget-header-skeleton">
            <div class="skeleton-shimmer header-title-skeleton" />
            <div class="skeleton-shimmer header-meta-skeleton" />
          </div>
          <div class="widget-body-skeleton">
            <div class="finance-metrics-skeleton">
              <div v-for="i in 3" :key="i" class="metric-box-skeleton skeleton-shimmer" />
            </div>
            <div class="finance-feed-skeleton">
              <div class="skeleton-shimmer text-line w-30 mb-3" />
              <div v-for="i in 2" :key="i" class="feed-item-skeleton skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>
      <!-- GIS Draft Feed Skeleton -->
      <div class="grid-col-1-2">
        <div class="sa-dashboard-card drafts-feed-card-skeleton">
          <div class="widget-header-skeleton">
            <div class="skeleton-shimmer header-title-skeleton" />
            <div class="skeleton-shimmer header-meta-skeleton" />
          </div>
          <div class="widget-body-skeleton">
            <div class="drafts-list-skeleton">
              <div v-for="i in 3" :key="i" class="draft-item-skeleton skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sa-dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.sa-dashboard-stats-skeleton {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-4;
  margin-bottom: $space-6;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.kpi-card-skeleton {
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: $space-4 $space-5;
  box-shadow: $shadow-sm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: $space-3-5;
  height: 110px;

  &__top {
    display: flex;
    align-items: center;
    gap: $space-4;

    .icon-skeleton {
      width: 48px;
      height: 48px;
      border-radius: $radius-md;
      flex-shrink: 0;
    }

    .label-value-skeleton {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex-grow: 1;
    }
  }

  &__bottom {
    border-top: 1px solid $color-border-light;
    padding-top: $space-3;
  }
}

.map-widget-card-skeleton {
  height: 420px;
  display: flex;
  flex-direction: column;
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;

  .widget-body-skeleton {
    flex-grow: 1;
  }
}

.capacity-widget-card-skeleton {
  height: 420px;
  display: flex;
  flex-direction: column;
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;

  .widget-body-skeleton {
    padding: $space-5;
    display: flex;
    flex-direction: column;
    gap: $space-4;
    flex-grow: 1;
  }

  .capacity-item-skeleton {
    display: flex;
    flex-direction: column;
    gap: $space-2;
    padding: $space-3-5 $space-4;
    background: $color-bg-subtle;
    border-radius: $radius-md;
  }
}

.finance-widget-card-skeleton {
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  display: flex;
  flex-direction: column;

  .widget-body-skeleton {
    padding: $space-5;
    display: flex;
    flex-direction: column;
    gap: $space-5;
  }

  .finance-metrics-skeleton {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $space-3;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .metric-box-skeleton {
    height: 60px;
    border-radius: $radius-md;
  }

  .finance-feed-skeleton {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  .feed-item-skeleton {
    height: 54px;
    border-radius: $radius-md;
  }
}

.drafts-feed-card-skeleton {
  height: 100%;
  min-height: 290px;
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  display: flex;
  flex-direction: column;

  .widget-body-skeleton {
    padding: $space-5;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .drafts-list-skeleton {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    width: 100%;
  }

  .draft-item-skeleton {
    height: 52px;
    border-radius: $radius-md;
    width: 100%;
  }
}

.widget-header-skeleton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-4 $space-5;
  background: $color-bg-subtle;
  border-bottom: 1px solid $color-border;
  height: 50px;

  .header-title-skeleton {
    height: 16px;
    width: 150px;
    border-radius: $radius-sm;
  }

  .header-meta-skeleton {
    height: 16px;
    width: 80px;
    border-radius: $radius-sm;
  }
}

.text-line {
  height: 10px;
  border-radius: $radius-sm;

  &.w-20 { width: 20%; }
  &.w-30 { width: 30%; }
  &.w-40 { width: 40%; }
  &.w-60 { width: 60%; }
  &.w-80 { width: 80%; }
  &.mb-3 { margin-bottom: $space-3; }
}

.progress-bar-skeleton {
  height: 6px;
  width: 100%;
  border-radius: $radius-sm;
}

// Shimmer Keyframes
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
