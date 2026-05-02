<template>
  <div class="kalkulator">
    <PageHeader
      title="Kalkulator Gizi"
      subtitle="Daftar resep makanan bergizi yang telah disimpan dari Kalkulator Gizi untuk distribusi wilayah Bandung."
      :breadcrumb="['Manajemen Gizi', 'Master Data Resep', 'Kalkulator Gizi']"
    />

    <div class="kalkulator__grid">
      <!-- LEFT COLUMN -->
      <div class="kalkulator__form">
        <RecipeBuilderCard
          v-model:nama-menu="state.namaResep"
          :bahan-items="state.bahanList"
          :bahan-options="dummyBahanOptions"
          :errors="errors"
          @add-bahan="onAddBahan"
          @remove-bahan="onRemoveBahan"
          @calculate="onCalculate"
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
          :total-calories="state.nutritionResult.calories"
          :protein="state.nutritionResult.protein"
          :karbohidrat="state.nutritionResult.karbo"
          :lemak="state.nutritionResult.lemak"
        />

        <div class="kalkulator__stat-grid">
          <NutritionStatCard
            v-for="stat in state.nutritionResult.stats"
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
import { reactive, onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resepSchema, mapResepErrors } from '@/validation/resep.schema'
import type { SelectOption } from '@/types/form'
import type { ResepFormErrors, StatVariant } from '@/types/gizi'
import PageHeader from '@/components/common/PageHeader.vue'
import RecipeBuilderCard from '@/components/gizi/RecipeBuilderCard.vue'
import NutritionSummaryCard from '@/components/gizi/NutritionSummaryCard.vue'
import NutritionStatCard from '@/components/gizi/NutritionStatCard.vue'
import HealthScoreCard from '@/components/gizi/HealthScoreCard.vue'

const route = useRoute()
const router = useRouter()

const dummyBahanOptions: SelectOption[] = [
  { label: 'Bayam Segar', value: 'bayam' },
  { label: 'Jagung Manis Pipil', value: 'jagung' },
  { label: 'Daging Ayam Dada', value: 'ayam' },
  { label: 'Tahu Putih', value: 'tahu' },
  { label: 'Tempe Kedelai', value: 'tempe' },
]

const state = reactive({
  namaResep: '',
  bahanList: [
    { id: '1', bahanId: '', gram: 0 }
  ],
  nutritionResult: {
    calories: 0,
    protein: { val: 0, percent: 0 },
    karbo: { val: 0, percent: 0 },
    lemak: { val: 0, percent: 0 },
    stats: [
      { label: 'Serat', value: 0, unit: 'g', icon: 'eco', status: '', variant: 'default' as StatVariant },
      { label: 'Natrium', value: 0, unit: 'mg', icon: 'water_drop', status: '', variant: 'default' as StatVariant },
      { label: 'Vit. C', value: 0, unit: 'mg', icon: 'nutrition', status: '', variant: 'default' as StatVariant },
      { label: 'Kalsium', value: 0, unit: 'mg', icon: 'vaccines', status: '', variant: 'default' as StatVariant },
    ]
  }
})

onMounted(() => {
  if (route.params.id) {
    state.namaResep = 'Nasi Ayam Sayur (Edit Mode)'
    state.bahanList = [
      { id: '1', bahanId: 'ayam', gram: 200 },
      { id: '2', bahanId: 'bayam', gram: 100 }
    ]
    onCalculate()
  } else {
    state.namaResep = ''
    state.bahanList = [
      { id: '1', bahanId: '', gram: 0 }
    ]
  }
})

const onAddBahan = () => {
  state.bahanList.push({ id: Date.now().toString(), bahanId: '', gram: 0 })
}

const onRemoveBahan = (index: number) => {
  state.bahanList.splice(index, 1)
}

const onCalculate = () => {
  state.nutritionResult = {
    calories: 342,
    protein: { val: 18.4, percent: 22 },
    karbo: { val: 42.1, percent: 48 },
    lemak: { val: 11.5, percent: 30 },
    stats: [
      { label: 'Serat', value: 5.2, unit: 'g', icon: 'eco', status: '+12% Daily Target', variant: 'success' as StatVariant },
      { label: 'Natrium', value: 420, unit: 'mg', icon: 'water_drop', status: 'High Sodium Alert', variant: 'danger' as StatVariant },
      { label: 'Vit. C', value: 24, unit: 'mg', icon: 'nutrition', status: 'Excellent Source', variant: 'warning' as StatVariant },
      { label: 'Kalsium', value: 85, unit: 'mg', icon: 'vaccines', status: 'Moderate', variant: 'default' as StatVariant },
    ]
  }
}

const errors = ref<ResepFormErrors>({})

function validateForm(): boolean {
  const result = resepSchema.safeParse({
    nama: state.namaResep,
    bahanList: state.bahanList,
  })

  if (!result.success) {
    errors.value = mapResepErrors(result.error)
    return false
  }

  errors.value = {}
  return true
}

// Debounced watcher — only watches form fields, not nutritionResult
let debounceTimer: ReturnType<typeof setTimeout>
const formData = computed(() => ({
  nama: state.namaResep,
  bahanList: state.bahanList,
}))

watch(formData, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => validateForm(), 300)
}, { deep: true })

function onSubmit() {
  if (!validateForm()) return

  // TODO: Replace with actual API call
  router.push({ name: 'master-resep' })
}
</script>

