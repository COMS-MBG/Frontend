<template>
  <div class="dashboard-skeleton">
    <!-- Row 1: KPI Stats Cards (4 Cards) -->
    <div class="stats-row-skeleton">
      <div v-for="i in 4" :key="i" class="kpi-card-skeleton">
        <div class="kpi-card-skeleton__left">
          <div class="skeleton-shimmer icon-skeleton" />
        </div>
        <div class="kpi-card-skeleton__right">
          <div class="skeleton-shimmer text-line w-40" />
          <div class="skeleton-shimmer text-line w-65" />
          <div class="skeleton-shimmer text-line w-80" />
        </div>
      </div>
    </div>

    <!-- Row 2: Supply & Logistics (2 Columns) -->
    <div class="main-grid-skeleton">
      <!-- SupplyStatusCard Skeleton -->
      <div class="widget-card-skeleton">
        <div class="widget-header-skeleton">
          <div class="skeleton-shimmer header-title-skeleton" />
          <div class="skeleton-shimmer header-meta-skeleton" />
        </div>
        <div class="widget-body-skeleton supply-body">
          <div class="menu-box-skeleton">
            <div class="skeleton-shimmer text-line w-30" />
            <div class="skeleton-shimmer text-line w-60" />
            <div class="skeleton-shimmer text-line w-80" />
          </div>
          <div class="bahan-list-skeleton">
            <div class="skeleton-shimmer text-line w-40 mb-2" />
            <div v-for="i in 3" :key="i" class="bahan-item-skeleton">
              <div class="skeleton-shimmer text-line w-50" />
              <div class="skeleton-shimmer progress-bar-skeleton" />
            </div>
          </div>
        </div>
      </div>

      <!-- LogisticsCard Skeleton -->
      <div class="widget-card-skeleton">
        <div class="widget-header-skeleton">
          <div class="skeleton-shimmer header-title-skeleton" />
        </div>
        <div class="widget-body-skeleton logistics-body">
          <div class="logistics-metrics-skeleton">
            <div v-for="i in 3" :key="i" class="metric-item-skeleton">
              <div class="skeleton-shimmer text-line w-30" />
              <div class="skeleton-shimmer text-line w-50" />
            </div>
          </div>
          <div class="skeleton-shimmer btn-skeleton" />
        </div>
      </div>
    </div>

    <!-- Row 3: Operational Feed & Metrics (2 Columns) -->
    <div class="bottom-grid-skeleton">
      <!-- PendingBastCard Skeleton -->
      <div class="widget-card-skeleton">
        <div class="widget-header-skeleton">
          <div class="skeleton-shimmer header-title-skeleton" />
          <div class="skeleton-shimmer header-meta-skeleton" />
        </div>
        <div class="widget-body-skeleton feed-body">
          <div class="feed-list-skeleton">
            <div v-for="i in 3" :key="i" class="feed-item-skeleton">
              <div class="feed-item-left">
                <div class="skeleton-shimmer text-line w-60" />
                <div class="skeleton-shimmer text-line w-40" />
              </div>
              <div class="skeleton-shimmer btn-item-skeleton" />
            </div>
          </div>
          <div class="skeleton-shimmer btn-skeleton mt-auto" />
        </div>
      </div>

      <!-- Supporting Info Stack -->
      <div class="info-stack-skeleton">
        <div v-for="i in 2" :key="i" class="mini-card-skeleton">
          <div class="mini-card-top">
            <div class="skeleton-shimmer mini-icon-skeleton" />
            <div class="mini-label-skeleton">
              <div class="skeleton-shimmer text-line w-60" />
              <div class="skeleton-shimmer text-line w-40" />
            </div>
          </div>
          <div class="skeleton-shimmer mini-badge-skeleton" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-skeleton {
  display: flex;
  flex-direction: column;
  gap: $space-8;
}

// Row 1
.stats-row-skeleton {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-4;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.kpi-card-skeleton {
  background: $color-bg-surface;
  border: 1px solid $color-border-light;
  border-radius: $radius-lg;
  padding: $space-5 $space-6;
  box-shadow: $shadow-xs;
  display: flex;
  align-items: center;
  gap: $space-4;
  height: 110px;

  &__left {
    .icon-skeleton {
      width: 48px;
      height: 48px;
      border-radius: $radius-md;
      flex-shrink: 0;
    }
  }

  &__right {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-grow: 1;
  }
}

// Row 2 & 3 grids
.main-grid-skeleton {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: $space-4;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.bottom-grid-skeleton {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: $space-4;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.info-stack-skeleton {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  @media (max-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

// Widget Cards
.widget-card-skeleton {
  background: $color-bg-surface;
  border: 1px solid $color-border-light;
  border-radius: $radius-lg;
  box-shadow: $shadow-xs;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 320px;
}

.widget-header-skeleton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-4 $space-5;
  background: $color-bg-subtle;
  border-bottom: 1px solid $color-border-light;
  height: 60px;

  .header-title-skeleton {
    height: 16px;
    width: 160px;
    border-radius: $radius-sm;
  }

  .header-meta-skeleton {
    height: 20px;
    width: 90px;
    border-radius: $radius-pill;
  }
}

.widget-body-skeleton {
  padding: $space-6;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.supply-body {
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.menu-box-skeleton {
  background: $color-bg-muted;
  border-radius: $radius-lg;
  padding: $space-4 $space-5;
  display: flex;
  flex-direction: column;
  gap: $space-3;
  justify-content: center;
}

.bahan-list-skeleton {
  display: flex;
  flex-direction: column;
  gap: $space-3.5;
}

.bahan-item-skeleton {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.logistics-body {
  justify-content: space-between;
}

.logistics-metrics-skeleton {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.metric-item-skeleton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed $color-border-light;
  padding-bottom: $space-3;
}

.feed-body {
  justify-content: space-between;
}

.feed-list-skeleton {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.feed-item-skeleton {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-3 $space-4;
  background: $color-bg-muted;
  border-radius: $radius-lg;
  border: 1px solid $color-border-light;

  .feed-item-left {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-grow: 1;
  }

  .btn-item-skeleton {
    width: 80px;
    height: 28px;
    border-radius: $radius-md;
    flex-shrink: 0;
  }
}

.mini-card-skeleton {
  background: $color-bg-surface;
  border: 1px solid $color-border-light;
  border-radius: $radius-lg;
  padding: $space-5 $space-6;
  box-shadow: $shadow-xs;
  display: flex;
  flex-direction: column;
  gap: $space-2;

  .mini-card-top {
    display: flex;
    align-items: center;
    gap: $space-3;

    .mini-icon-skeleton {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .mini-label-skeleton {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex-grow: 1;
    }
  }

  .mini-badge-skeleton {
    height: 20px;
    width: 120px;
    border-radius: $radius-sm;
    margin-top: 4px;
  }
}

// Button skeleton
.btn-skeleton {
  width: 140px;
  height: 36px;
  border-radius: $radius-md;

  @media (max-width: 640px) {
    width: 100%;
  }
}

// Helpers
.text-line {
  height: 10px;
  border-radius: $radius-sm;

  &.w-30 { width: 30%; }
  &.w-40 { width: 40%; }
  &.w-50 { width: 50%; }
  &.w-60 { width: 60%; }
  &.w-65 { width: 65%; }
  &.w-80 { width: 80%; }
  &.mb-2 { margin-bottom: $space-2; }
}

.progress-bar-skeleton {
  height: 6px;
  width: 100%;
  border-radius: $radius-pill;
}

// Shimmer Animation
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
