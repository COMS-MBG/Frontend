<script setup lang="ts">
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const emit = defineEmits<{
  (e: 'import-csv'): void
  (e: 'export-csv'): void
  (e: 'generate-pdf'): void
}>()
</script>

<template>
  <div class="tools-section">
    <!-- ── Ekspor Laporan ── -->
    <BaseCard title="Ekspor Laporan" padding="md">
      <div class="tools-grid">
        <div class="tool-item">
          <div class="tool-info">
            <span class="material-symbols-outlined tool-icon">picture_as_pdf</span>
            <div>
              <p class="tool-title">Generate Laporan PDF</p>
              <p class="tool-desc">Buat laporan operasional dalam format PDF</p>
            </div>
          </div>
          <BaseButton variant="primary" size="sm" icon="picture_as_pdf" @click="emit('generate-pdf')">
            Generate PDF
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- ── Sinkronisasi Data ── -->
    <BaseCard title="Sinkronisasi Data" padding="md">
      <div class="tools-grid">
        <div class="tool-item">
          <div class="tool-info">
            <span class="material-symbols-outlined tool-icon">upload_file</span>
            <div>
              <p class="tool-title">Import Data CSV</p>
              <p class="tool-desc">Unggah data distribusi dari file CSV</p>
            </div>
          </div>
          <BaseButton variant="primary" size="sm" icon="upload_file" @click="emit('import-csv')">
            Import
          </BaseButton>
        </div>

        <div class="tool-item">
          <div class="tool-info">
            <span class="material-symbols-outlined tool-icon">download</span>
            <div>
              <p class="tool-title">Export Data CSV</p>
              <p class="tool-desc">Unduh data laporan ke format CSV</p>
            </div>
          </div>
          <BaseButton variant="primary" size="sm" icon="download" @click="emit('export-csv')">
            Export
          </BaseButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped lang="scss">
.tools-section {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.tools-grid {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.tool-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-4;
  padding: $space-4;
  border-radius: $radius-md;
  background-color: $color-bg-subtle;
  border: 1px solid transparent;
  transition: all $transition-smooth;

  &:hover {
    background-color: $color-bg-surface;
    border-color: $color-border-light;
    box-shadow: $shadow-sm;
    transform: translateY(-2px);

    .tool-icon {
      color: $color-primary;
      transform: scale(1.15) rotate(-5deg);
    }
  }
}

.tool-info {
  display: flex;
  align-items: center;
  gap: $space-3;
  flex: 1;
  min-width: 0;
}

.tool-icon {
  font-size: 1.5rem;
  color: $color-text-faint;
  flex-shrink: 0;
  transition: color $transition-base, transform $transition-base;
}

.tool-title {
  margin: 0;
  font-size: $text-base;
  font-weight: 600;
  color: $color-text-primary;
}

.tool-desc {
  margin: 0;
  font-size: $text-sm;
  color: $color-text-muted;
}
</style>
