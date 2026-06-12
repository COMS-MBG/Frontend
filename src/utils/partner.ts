export const OWNERSHIP_STATUS_MAP = {
  public: {
    label: 'Negeri',
    variant: 'success',
    icon: 'account_balance',
  },
  private: {
    label: 'Swasta',
    variant: 'info',
    icon: 'apartment',
  },
} as const

export interface OwnershipInfo {
  label: string
  variant: 'success' | 'info' | 'default'
  icon: string
}

/** Get ownership info (label, badge variant, icon) for UI display. */
export function getOwnershipInfo(status: string | null | undefined): OwnershipInfo {
  if (!status) {
    return {
      label: '—',
      variant: 'default',
      icon: 'help',
    }
  }

  const s = status.toLowerCase()
  if (s === 'public' || s === 'negeri') {
    return {
      label: OWNERSHIP_STATUS_MAP.public.label,
      variant: OWNERSHIP_STATUS_MAP.public.variant,
      icon: OWNERSHIP_STATUS_MAP.public.icon,
    }
  }

  if (s === 'private' || s === 'swasta') {
    return {
      label: OWNERSHIP_STATUS_MAP.private.label,
      variant: OWNERSHIP_STATUS_MAP.private.variant,
      icon: OWNERSHIP_STATUS_MAP.private.icon,
    }
  }

  return {
    label: status,
    variant: 'default',
    icon: 'help',
  }
}
