<template>
  <div class="sppg-detail-menus">
    <div class="menus-header">
      <div class="menus-header__title">
        <span class="material-symbols-outlined icon">restaurant_menu</span>
        <h3>Rencana & Jadwal Menu ({{ menus.length }})</h3>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="menus.length === 0" class="empty-state">
      <span class="material-symbols-outlined empty-icon">restaurant_menu</span>
      <h4>Belum Ada Perencanaan Menu</h4>
      <p>SPPG ini belum merilis atau menjadwalkan menu makanan.</p>
    </div>

    <!-- Menu Periods Grid -->
    <div v-else class="periods-list">
      <div v-for="m in menus" :key="m.menu_id" class="period-card">
        <div class="period-card__header">
          <div class="period-title">
            <h4>{{ m.menu_name }}</h4>
            <span class="period-dates">
              {{ formatDate(m.week_start) }} — {{ formatDate(m.week_end) }}
            </span>
          </div>
          <BaseBadge :variant="getStatusVariant(m.status)">
            {{ m.status_label }}
          </BaseBadge>
        </div>

        <!-- Recipes Timeline -->
        <div class="period-card__body">
          <div v-if="!m.recipes_by_day || m.recipes_by_day.length === 0" class="no-recipes">
            <p>Tidak ada rincian resep untuk periode ini.</p>
          </div>
          <div v-else class="recipes-grid">
            <div 
              v-for="(day, idx) in m.recipes_by_day" 
              :key="idx" 
              class="day-card"
            >
              <div class="day-card__header">
                <span class="day-name">{{ translateDay(day.day_name) }}</span>
                <span class="day-date">{{ formatDateShort(day.menu_date) }}</span>
              </div>
              <div class="day-card__body">
                <div class="meal-info">
                  <div class="meal-icon-wrap">
                    <span class="material-symbols-outlined meal-icon">lunch_dining</span>
                  </div>
                  <div class="meal-text">
                    <span class="recipe-name">{{ day.recipe_name || '—' }}</span>
                  </div>
                </div>

                <!-- Nutrition info with premium color-coded badges -->
                <div v-if="day.total_calorie" class="nutrition-grid">
                  <div class="nutri-badge nutri-badge--calorie" title="Energi / Kalori">
                    <span class="material-symbols-outlined nutri-icon">local_fire_department</span>
                    <span>{{ Math.round(day.total_calorie) }} kkal</span>
                  </div>
                  <div class="nutri-badge nutri-badge--protein" title="Protein">
                    <span class="nutri-label">P</span>
                    <span>{{ Math.round(day.total_protein ?? 0) }}g</span>
                  </div>
                  <div class="nutri-badge nutri-badge--carbs" title="Karbohidrat">
                    <span class="nutri-label">K</span>
                    <span>{{ Math.round(day.total_carbs ?? 0) }}g</span>
                  </div>
                  <div class="nutri-badge nutri-badge--fat" title="Lemak">
                    <span class="nutri-label">L</span>
                    <span>{{ Math.round(day.total_fat ?? 0) }}g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseBadge from '@/components/common/BaseBadge.vue'

// Define typings matching the backend response
interface DayRecipe {
  day_of_week: number
  day_name: string
  menu_date: string
  meal_time: string
  recipe_id: number
  recipe_name: string | null
  calories_kcal: string | null
  total_calorie: number | null
  total_protein: number | null
  total_carbs: number | null
  total_fat: number | null
}

interface MenuPeriod {
  menu_id: number
  menu_name: string
  week_start: string
  week_end: string
  status: 'published' | 'scheduled' | 'planned' | 'archived'
  status_label: string
  recipes_by_day: DayRecipe[]
}

defineProps<{
  menus: MenuPeriod[]
}>()

function getStatusVariant(status: string): 'success' | 'warning' | 'info' | 'default' {
  const map: Record<string, 'success' | 'warning' | 'info' | 'default'> = {
    published: 'success',
    scheduled: 'info',
    planned: 'warning',
    archived: 'default'
  }
  return map[status] ?? 'default'
}

function translateDay(dayName: string): string {
  const map: Record<string, string> = {
    Monday: 'Senin',
    Tuesday: 'Selasa',
    Wednesday: 'Rabu',
    Thursday: 'Kamis',
    Friday: 'Jumat',
    Saturday: 'Sabtu',
    Sunday: 'Minggu'
  }
  return map[dayName] ?? dayName
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return '—'
  }
}

function formatDateShort(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  } catch {
    return '—'
  }
}
</script>

<style scoped lang="scss">
.sppg-detail-menus {
  width: 100%;
}

.menus-header {
  margin-bottom: $space-4;

  &__title {
    display: flex;
    align-items: center;
    gap: $space-2;

    .icon {
      font-size: 1.25rem;
      color: $color-primary;
    }

    h3 {
      margin: 0;
      font-size: $text-base;
      font-weight: 600;
      color: $color-text-primary;
    }
  }
}

// Periods List
.periods-list {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.period-card {
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-4 $space-5;
    background: $color-bg-subtle;
    border-bottom: 1px solid $color-border;
  }

  .period-title {
    display: flex;
    flex-direction: column;
    gap: 2px;

    h4 {
      margin: 0;
      font-size: $text-base;
      font-weight: 700;
      color: $color-text-primary;
    }

    .period-dates {
      font-size: $text-xs;
      color: $color-text-muted;
    }
  }

  &__body {
    padding: $space-5;
  }
}

.no-recipes {
  text-align: center;
  padding: $space-4;
  color: $color-text-muted;
  font-size: $text-sm;
}

// Daily Recipes Grid (Aligned horizontally with 5 columns for Mon-Fri)
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: $space-4;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
}

.day-card {
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: $shadow-xs;
  transition: all $transition-smooth;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;
    border-color: $color-primary-muted;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-3 $space-4;
    background: $color-bg-subtle;
    border-bottom: 1px solid $color-border-light;

    .day-name {
      font-size: $text-xs;
      font-weight: 800;
      color: $color-primary;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .day-date {
      font-size: 11px;
      font-weight: 500;
      color: $color-text-muted;
    }
  }

  &__body {
    padding: $space-4;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: $space-4;
  }
}

.meal-info {
  display: flex;
  gap: $space-3;
  align-items: flex-start;

  .meal-icon-wrap {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: $color-primary-light;
    color: $color-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .meal-icon {
    font-size: 1.15rem;
  }

  .meal-text {
    flex: 1;
  }

  .recipe-name {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-text-primary;
    line-height: 1.4;
  }
}

// Nutrition Grid (Styled like premium fitness macro indicators)
.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: auto;
}

.nutri-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: $space-1.5 $space-2;
  border-radius: $radius-md;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  
  .nutri-icon {
    font-size: 14px;
  }
  
  .nutri-label {
    font-weight: 800;
    font-size: 10px;
    opacity: 0.85;
    text-transform: uppercase;
  }

  // Color-coded variations
  &--calorie {
    background-color: $color-warning-bg;
    border: 1px solid $color-warning-border;
    color: $color-warning;
    grid-column: span 3;
    font-size: 12px;
    
    .nutri-icon {
      font-size: 16px;
    }
  }

  &--protein {
    background-color: $color-success-bg;
    border: 1px solid $color-success-border;
    color: $color-success;
  }

  &--carbs {
    background-color: $color-primary-light;
    border: 1px solid $color-primary-muted;
    color: $color-primary;
  }

  &--fat {
    background-color: $color-purple-subtle;
    border: 1px solid rgba(139, 92, 246, 0.25);
    color: $color-purple;
  }
}

// Empty State CSS
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-12 $space-6;
  text-align: center;
  background: $color-bg-surface;
  border-radius: $radius-lg;
  border: 1px dashed $color-border;

  .empty-icon {
    font-size: 3rem;
    color: $color-text-faint;
    margin-bottom: $space-4;
  }

  h4 {
    margin: 0 0 $space-2 0;
    font-size: $text-base;
    font-weight: 600;
    color: $color-text-primary;
  }

  p {
    margin: 0;
    font-size: $text-sm;
    color: $color-text-muted;
    max-width: 360px;
  }
}
</style>
