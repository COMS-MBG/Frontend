import { defineStore } from 'pinia'

export type SpatialMode = 'default' | 'blind' | 'simulation' | 'routing'

export interface School {
  id: string
  name: string
  lat: number
  lng: number
  distanceKm: number
  students: number
}

export interface SPPG {
  id: string
  name: string
  lat: number
  lng: number
}

export const useSpatialStore = defineStore('spatial', {
  state: () => ({
    mode: 'default' as SpatialMode,
    sppgLocations: [
      { id: 'sppg-1', name: 'SPPG Pusat (Dapur Utama)', lat: -6.9200, lng: 107.6300 }
    ] as SPPG[],
    schools: [] as School[],
    blindSpots: [] as School[],
    selectedSchool: null as School | null,
    simulationResult: null as any,
  }),

  getters: {
    isCritical: (state) => (school: School) => {
      // In production, this can incorporate traffic data or complex logic from backend
      return school.distanceKm > 5
    }
  },

  actions: {
    toggleBlindSpot(show: boolean) {
      if (show) {
        this.mode = 'blind'
        this.selectedSchool = null
      } else {
        this.mode = 'default'
        this.selectedSchool = null
        this.simulationResult = null
      }
    },
    selectSchool(id: string) {
      this.selectedSchool = this.blindSpots.find(s => s.id === id) || null
    },
    runSimulation() {
      if (!this.selectedSchool) return
      this.mode = 'simulation'
      
      // Dummy simulation logic for visual
      this.simulationResult = {
        proposedSppg: {
          lat: this.selectedSchool.lat + 0.012,
          lng: this.selectedSchool.lng - 0.008,
        },
        polygon: [
          [this.selectedSchool.lat + 0.03, this.selectedSchool.lng - 0.02],
          [this.selectedSchool.lat + 0.02, this.selectedSchool.lng + 0.02],
          [this.selectedSchool.lat - 0.02, this.selectedSchool.lng + 0.02],
          [this.selectedSchool.lat - 0.01, this.selectedSchool.lng - 0.03],
        ],
        newStudents: 1250,
        efficiency: '92%',
        coverage: '98%',
      }
    },
    runRouting() {
      if (!this.selectedSchool) return
      this.mode = 'routing'
      // Future routing implementation
    },
    resetSimulation() {
      this.mode = 'blind'
      this.simulationResult = null
    },
    
    // Seed dummy data for demo
    seedData() {
      this.schools = Array.from({ length: 500 }).map((_, i) => {
        const lat = -6.9200 + (Math.random() - 0.5) * 0.2
        const lng = 107.6300 + (Math.random() - 0.5) * 0.2
        const distanceKm = Math.sqrt(Math.pow(lat - -6.9200, 2) + Math.pow(lng - 107.6300, 2)) * 111
        
        return {
          id: `sch-${i}`,
          name: `Sekolah ${i + 1}`,
          lat,
          lng,
          distanceKm: Number(distanceKm.toFixed(1)),
          students: Math.floor(Math.random() * 500) + 100
        }
      })
      
      this.blindSpots = this.schools.filter(s => this.isCritical(s))
    }
  }
})
