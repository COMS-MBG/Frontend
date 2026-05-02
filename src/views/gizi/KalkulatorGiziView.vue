<template>
  <div class="kalkulator">
    <PageHeader
      title="Kalkulator Gizi"
      subtitle="Kalkulasi resep makanan untuk penyaluran bantuan pangan"
      :breadcrumb="['Manajemen Gizi', 'Master Data Resep', 'Kalkulator Gizi']"
    />

    <div class="kalkulator__grid">
      <!-- LEFT COLUMN -->
      <div class="kalkulator__form">
        <RecipeBuilderCard
          v-model:nama-menu="formState.namaResep"
          :bahan-items="formState.bahanList"
          :bahan-options="bahanOptions"
          :errors="errors"
          @add-bahan="addBahan"
          @remove-bahan="removeBahan"
          @calculate="calculate"
          @save="onSubmit"
        />

        <div class="kalkulator__tip">
          <span class="material-symbols-outlined kalkulator__tip-icon">info</span>
          <div class="kalkulator__tip-content">
            <h4>Pro Tip: Akurasi Data</h4>
            <p>Data nutrisi diambil secara real-time dari database Kemenkes RI & USDA. Pastikan input berat dalam kondisi bahan mentah untuk hasil paling akurat.</p>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="kalkulator__result">
        <NutritionSummaryCard
          :total-calories="nutritionResult.calories"
          :protein="nutritionResult.protein"
          :karbohidrat="nutritionResult.karbo"
          :lemak="nutritionResult.lemak"
        />

        <div class="kalkulator__stat-grid">
          <NutritionStatCard
            v-for="stat in nutritionResult.stats"
            :key="stat.label"
            :label="stat.label"
            :value="stat.value"
            :unit="stat.unit"
            :icon="stat.icon"
            :status="stat.status"
            :variant="stat.variant"
          />
        </div>

        <HealthScoreCard />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResepForm } from '@/composables/useResepForm'
import { useBahanStore } from '@/stores/bahan.store'
import { bahanDummy } from '@/data/bahan.dummy'

import PageHeader from '@/components/common/PageHeader.vue'
import RecipeBuilderCard from '@/components/gizi/RecipeBuilderCard.vue'
import NutritionSummaryCard from '@/components/gizi/NutritionSummaryCard.vue'
import NutritionStatCard from '@/components/gizi/NutritionStatCard.vue'
import HealthScoreCard from '@/components/gizi/HealthScoreCard.vue'

const route = useRoute()
const router = useRouter()

// ── Ensure bahan store is seeded (needed for bahanOptions) ──
const bahanStore = useBahanStore()
onMounted(() => {
  if (bahanStore.items.length === 0) {
    bahanStore.setItems(bahanDummy)
  }
})

// Initialize Composable
const {
  formState,
  bahanOptions,
  nutritionResult,
  errors,
  addBahan,
  removeBahan,
  calculate,
  loadRecipe,
  saveRecipe,
  resetForm,
} = useResepForm()

onMounted(() => {
  if (route.params.id) {
    loadRecipe(Number(route.params.id))
  } else {
    resetForm()
  }
})

function onSubmit() {
  if (saveRecipe()) {
    router.push({ name: 'master-resep' })
  }
}
</script>
