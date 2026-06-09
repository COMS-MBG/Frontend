<template>
  <div class="sppg-detail-partners">
    <div class="partners-header">
      <div class="partners-header__title">
        <span class="material-symbols-outlined icon">school</span>
        <h3>Sekolah Mitra Terhubung ({{ partners.length }})</h3>
      </div>
      <button 
        class="btn-primary btn-with-icon" 
        type="button"
        @click="$emit('open-assign')"
      >
        <span class="material-symbols-outlined">add_link</span>
        <span>Hubungkan Sekolah</span>
      </button>
    </div>

    <!-- Alert / Action Banner explaining the decouple consequences -->
    <div v-if="partners.length > 0" class="partners-info-banner">
      <span class="material-symbols-outlined banner-icon">info</span>
      <div class="banner-content">
        <span class="banner-title">Informasi Pengelolaan Hubungan Mitra</span>
        <span class="banner-text">
          Daftar sekolah mitra yang terhubung untuk disuplai porsi makanan harian oleh SPPG ini. Tombol 
          <strong>Putus Kemitraan</strong> akan mencabut hubungan logistik, menghentikan seluruh pengiriman makanan, dan mengembalikan sekolah ke status <strong>Tidak Terlayani</strong>.
        </span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="partners.length === 0" class="empty-state">
      <span class="material-symbols-outlined empty-icon">school</span>
      <h4>Belum Ada Sekolah Mitra</h4>
      <p>SPPG ini belum dihubungkan dengan sekolah mitra mana pun.</p>
    </div>

    <!-- Data Table (Styled like other dashboard tables) -->
    <div v-else class="partners-table-wrap">
      <table class="partners-table">
        <thead>
          <tr>
            <th class="th-center">NO</th>
            <th class="th-name">NAMA SEKOLAH</th>
            <th class="th-center">NPSN</th>
            <th class="th-center">PORSI HARIAN</th>
            <th class="th-center">JARAK PENGIRIMAN</th>
            <th class="th-center">ESTIMASI WAKTU</th>
            <th class="th-center">STATUS JARAK</th>
            <th class="th-aksi">AKSI</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, idx) in partners" :key="p.id">
            <td class="td-center text-muted">{{ idx + 1 }}</td>
            <td class="td-name">
              <div class="school-name-inner">
                <div class="school-thumb">
                  <span class="material-symbols-outlined school-thumb-icon">school</span>
                </div>
                <div class="school-text">
                  <span class="school-name">{{ p.school_name }}</span>
                  <span v-if="p.address" class="school-address">{{ p.address }}</span>
                </div>
              </div>
            </td>
            <td class="td-center font-mono text-secondary">{{ p.npsn || '—' }}</td>
            <td class="td-num font-semibold text-primary">
              {{ p.portion_count.toLocaleString('id-ID') }}
            </td>
            <td class="td-center font-mono">
              {{ p.distance_km ? `${p.distance_km.toFixed(2)} km` : '—' }}
            </td>
            <td class="td-center font-mono">
              {{ p.estimated_minutes ? `${Math.round(p.estimated_minutes)} mnt` : '—' }}
            </td>
            <td class="td-center">
              <BaseBadge :variant="p.distance_status === 'safe' ? 'success' : 'warning'">
                {{ p.distance_status === 'safe' ? 'Aman' : 'Perlu Tinjauan' }}
              </BaseBadge>
            </td>
            <td class="td-aksi">
              <button 
                class="btn-detach" 
                aria-label="Putus Kemitraan Sekolah"
                @click="$emit('detach', p.id, p.school_name)"
              >
                <span class="material-symbols-outlined icon-btn">link_off</span>
                <span>Putus Kemitraan</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SppgPartner } from '@/types/superadmin-sppg'
import BaseBadge from '@/components/common/BaseBadge.vue'

defineProps<{
  partners: SppgPartner[]
}>()

defineEmits<{
  (e: 'detach', partnerId: string | number, schoolName: string): void
  (e: 'open-assign'): void
}>()
</script>

<style scoped lang="scss">
.sppg-detail-partners {
  width: 100%;
}

.partners-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $space-4;
  gap: $space-4;

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

// Banner Info
.partners-info-banner {
  display: flex;
  align-items: flex-start;
  gap: $space-3;
  background-color: $color-primary-light;
  border: 1px solid $color-primary-muted;
  padding: $space-4;
  border-radius: $radius-lg;
  margin-bottom: $space-5;

  .banner-icon {
    font-size: 1.25rem;
    color: $color-primary;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .banner-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: $text-xs;
    line-height: 1.5;
    color: $color-text-secondary;

    .banner-title {
      font-weight: 700;
      color: $color-text-primary;
    }

    .banner-text {
      color: $color-text-secondary;
    }
  }
}

// Table Wrapper (Styled exactly like standard table wrapper mixins)
.partners-table-wrap {
  @include card-base($radius-lg, $shadow-xs);
  overflow: hidden;
  overflow-x: auto;
  scrollbar-width: thin;
}

.partners-table {
  width: 100%;
  border-collapse: collapse;
  font-family: $font-body;

  thead {
    position: sticky;
    top: 0;
    z-index: 2;

    tr {
      background-color: $color-bg-subtle;
      border-bottom: 1px solid $color-border;
    }

    th {
      padding: $space-4 $space-5;
      font-size: $text-xs;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $color-text-muted;
      white-space: nowrap;
      text-align: left;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid $color-border-light;
      transition: background-color $transition-fast;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: $color-bg-subtle;
      }
    }

    td {
      padding: $space-5 $space-4;
      vertical-align: middle;
      font-size: $text-sm;
      color: $color-text-secondary;
    }
  }

  // Column styles matching other modules
  .th-name {
    color: $color-text-primary;
    min-width: 240px;
  }

  .th-center {
    text-align: center;
  }

  .th-aksi {
    text-align: center;
    width: 175px;
  }

  .td-center {
    text-align: center;
  }

  .td-name {
    min-width: 240px;
  }

  .td-num {
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .td-aksi {
    text-align: center;
    white-space: nowrap;
  }
}

// School info cell matching SaSchoolRow.vue
.school-name-inner {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.school-thumb {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: $color-bg-subtle;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $color-border-light;
}

.school-thumb-icon {
  font-size: $text-xl;
  color: $color-text-faint;
}

.school-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.school-name {
  font-size: $text-sm;
  font-weight: 600;
  color: $color-text-primary;
}

.school-address {
  font-size: $text-xs;
  color: $color-text-muted;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Helper Utilities
.text-muted { color: $color-text-muted; }
.text-secondary { color: $color-text-secondary; }
.font-semibold { font-weight: 600; }
.font-mono { font-family: $font-mono; font-size: $text-xs; }
.text-primary { color: $color-primary; }

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

// Detach Action Button
.btn-detach {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-1.5;
  background-color: $color-danger-bg;
  border: 1px solid $color-danger-border;
  padding: $space-1.5 $space-3;
  border-radius: $radius-md;
  color: $color-danger;
  font-size: $text-xs;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-base;

  .icon-btn {
    font-size: 1.05rem;
    transition: transform $transition-fast;
  }

  &:hover {
    background-color: $color-danger;
    border-color: $color-danger;
    color: $color-text-inverse;
    box-shadow: 0 2px 6px rgba(239, 68, 68, 0.15);

    .icon-btn {
      transform: scale(1.05);
    }
  }

  &:active {
    transform: scale(0.97);
  }
}
</style>
