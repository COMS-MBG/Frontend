<template>
  <div class="kalkulator">

    <!-- ═══════════════════════════════════════
         HEADER + BACK BUTTON
    ════════════════════════════════════════ -->
    <PageHeader
      title="Kalkulator Gizi"
      subtitle="Kalkulasi resep makanan untuk penyaluran bantuan pangan"
      :breadcrumb="['Manajemen Gizi', 'Master Data Resep', 'Kalkulator Gizi']"
    >
      <template #actions>
        <button class="btn-secondary btn-with-icon" @click="onBack">
          <span class="material-symbols-outlined">arrow_back</span>
          Kembali
        </button>
      </template>
    </PageHeader>

    <div class="kalkulator__grid">
      <!-- LEFT COLUMN -->
      <div class="kalkulator__form">
        <RecipeBuilderCard
          v-model:nama-menu="formState.namaResep"
          :bahan-items="formState.bahanList"
          :bahan-options="bahanOptions"
          :errors="errors"
          :is-saving="isSaving"
          :is-loading="isLoadingRecipe"
          @add-bahan="addBahan"
          @remove-bahan="removeBahan"
          @calculate="calculate"
          @save="onSubmit"
        />

        <div class="kalkulator__tip">
          <span class="material-symbols-outlined kalkulator__tip-icon">info</span>
          <div class="kalkulator__tip-content">
            <h4>Pro Tip: Akurasi Data</h4>
            <p>Data nutrisi dihitung secara real-time dari database bahan baku. Pastikan input berat dalam kondisi bahan mentah untuk hasil paling akurat.</p>
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

        <HealthScoreCard
          :protein-percent="nutritionResult.protein.percent"
          :karbo-percent="nutritionResult.karbo.percent"
          :lemak-percent="nutritionResult.lemak.percent"
          :total-calories="nutritionResult.calories"
          :recipe-name="formState.namaResep"
          @print="onPrint"
        />
      </div>
    </div>

    <!-- ═══════════════════════════════════════
         RESULT MODAL (Success / Error)
    ════════════════════════════════════════ -->
    <ResultModal
      v-model="isResultOpen"
      :title="resultVariant === 'success' ? 'Berhasil' : 'Gagal'"
      :headline="resultHeadline"
      :message="resultMessage"
      :variant="resultVariant"
    />

    <!-- ═══════════════════════════════════════
         PRINT REPORT OVERLAY
    ════════════════════════════════════════ -->
    <PrintRecipeReport
      v-model="isPrintOpen"
      :recipe-name="formState.namaResep"
      :total-calories="nutritionResult.calories"
      :protein="nutritionResult.protein"
      :karbohidrat="nutritionResult.karbo"
      :lemak="nutritionResult.lemak"
      :printed-by="userName"
      :ingredients="resolvedIngredients"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResepForm } from '@/composables/useResepForm'
import { useAuthStore } from '@/stores/auth.store'

import PageHeader from '@/components/common/PageHeader.vue'
import ResultModal from '@/components/common/ResultModal.vue'
import RecipeBuilderCard from '@/components/gizi/kalkulator-gizi/RecipeBuilderCard.vue'
import NutritionSummaryCard from '@/components/gizi/kalkulator-gizi/NutritionSummaryCard.vue'
import HealthScoreCard from '@/components/gizi/kalkulator-gizi/HealthScoreCard.vue'
import PrintRecipeReport from '@/components/gizi/kalkulator-gizi/PrintRecipeReport.vue'

const route = useRoute()
const router = useRouter()

// ── Auth — username for watermark ─────────────────────────────────────────────
const authStore = useAuthStore()
const userName = computed(() => authStore.userName || 'Pengguna Tidak Dikenal')

// ── Initialize Composable ─────────────────────────────────────────────────────
const {
  formState,
  bahanOptions,
  nutritionResult,
  errors,
  isSaving,
  isLoadingRecipe,
  isLoadingIngredients,
  saveError,
  addBahan,
  removeBahan,
  calculate,
  loadRecipe,
  saveRecipe,
  resetForm,
  loadIngredients,
  ingredientCache,
} = useResepForm()

// ── Resolved ingredient list for print report ─────────────────────────────────
// Maps each bahan row to include the display name from ingredientCache
const resolvedIngredients = computed(() =>
  formState.bahanList
    .filter(b => b.bahanId)
    .map(b => {
      const found = ingredientCache.value.find(i => i.id === Number(b.bahanId))
      return {
        ...b,
        namaIngredient: found?.name ?? `Bahan #${b.bahanId}`,
      }
    }),
)

// ── Result Modal State ────────────────────────────────────────────────────────
const isResultOpen = ref(false)
const resultHeadline = ref('')
const resultMessage = ref('')
const resultVariant = ref<'success' | 'error'>('success')

function showResult(headline: string, message: string, variant: 'success' | 'error' = 'success') {
  resultHeadline.value = headline
  resultMessage.value = message
  resultVariant.value = variant
  isResultOpen.value = true
}

// ── Print State ───────────────────────────────────────────────────────────────
const isPrintOpen = ref(false)

/**
 * Called when HealthScoreCard emits 'print'.
 * 1. Sets isPrintOpen so PrintRecipeReport is mounted in the DOM.
 * 2. Waits one tick for Vue to render the overlay.
 * 3. Calls window.print() — the @media print CSS makes only .prr-overlay visible.
 * 4. Resets isPrintOpen so the overlay is cleaned up from the DOM.
 */
async function onPrint() {
  isPrintOpen.value = true
  await nextTick()
  window.print()
  isPrintOpen.value = false
}

// ── Back Navigation ───────────────────────────────────────────────────────────
function onBack() {
  router.push({ name: 'master-resep' })
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  await loadIngredients()

  if (route.params.id) {
    await loadRecipe(Number(route.params.id))
  } else {
    resetForm()
  }
})

// ── Submit Handler ────────────────────────────────────────────────────────────
async function onSubmit() {
  const isEdit = !!route.params.id
  const success = await saveRecipe()

  if (success) {
    showResult(
      isEdit ? 'Resep Berhasil Diperbarui' : 'Resep Berhasil Disimpan',
      `Resep "${formState.namaResep}" telah ${isEdit ? 'diperbarui' : 'ditambahkan'} ke sistem.`,
      'success',
    )
  } else {
    const errorMsg = extractErrorMessage(saveError.value)
    showResult('Gagal Menyimpan Resep', errorMsg, 'error')
  }
}

/**
 * Extract a user-friendly error message from the save error.
 * Handles Axios 422 validation errors and generic errors.
 */
function extractErrorMessage(err: string | null): string {
  if (!err) return 'Terjadi kesalahan yang tidak diketahui.'
  return err
}
</script>
