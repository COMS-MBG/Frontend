import L from 'leaflet'

export const sppgIcon = L.divIcon({
  html: `<div style="background:#1e40af;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 6px rgba(0,0,0,0.3);"><span class="material-symbols-outlined" style="font-size:18px;">warehouse</span></div>`,
  className: 'custom-sppg-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
})

export const schoolIcon = L.divIcon({
  html: `<div style="background:#3b82f6;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2);"><span class="material-symbols-outlined" style="font-size:14px;">school</span></div>`,
  className: 'custom-school-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
})

export const proposedSppgIcon = L.divIcon({
  html: `<div style="background:#10b981;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 0 0 8px rgba(16, 185, 129, 0.2);animation: pulse 2s infinite;"><span class="material-symbols-outlined" style="font-size:20px;">add_location</span></div>`,
  className: 'custom-sppg-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 18]
})

export const getBlindSpotIcon = (isActive: boolean) => L.divIcon({
  html: `<div style="background:${isActive ? '#ef4444' : '#f87171'};color:white;width:${isActive ? 32 : 24}px;height:${isActive ? 32 : 24}px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:${isActive ? '0 0 0 6px rgba(239,68,68,0.3)' : '0 2px 4px rgba(0,0,0,0.2)'};transition:all 0.2s;"><span class="material-symbols-outlined" style="font-size:${isActive ? 18 : 14}px;">error</span></div>`,
  className: 'custom-blind-icon',
  iconSize: isActive ? [32, 32] : [24, 24],
  iconAnchor: isActive ? [16, 16] : [12, 12]
})

export const createClusterIcon = (count: number, color: 'blue' | 'red' = 'blue') => {
  const bg = color === 'blue' ? 'rgba(59, 130, 246, 0.9)' : 'rgba(239, 68, 68, 0.9)'
  return L.divIcon({
    html: `<div style="background:${bg};color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);">${count}</div>`,
    className: 'custom-cluster-icon',
    iconSize: [36, 36]
  })
}
