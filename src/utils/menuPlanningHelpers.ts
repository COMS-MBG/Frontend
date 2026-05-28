import type { Menu, MenuForm, EditableDayItem } from '@/types/menu-planning'
import { DAY_NAMES } from '@/types/menu-planning'

/**
 * Compute date string (YYYY-MM-DD) for a given day_of_week (1=Mon..4=Thu)
 * relative to a week_start date.
 */
export function computeDateForDay(weekStart: string, dayOfWeek: number): string {
  const base = new Date(weekStart)
  base.setDate(base.getDate() + (dayOfWeek - 1))
  return base.toISOString().slice(0, 10)
}

/**
 * Build an array of EditableDayItem from a Menu API response.
 * Always produces exactly 4 days (Mon-Thu), filling gaps with empty slots.
 */
export function buildEditDays(menu: Menu): EditableDayItem[] {
  const result: EditableDayItem[] = []

  for (let dow = 1; dow <= 4; dow++) {
    const dayGroup = menu.items?.find((d) => d.day_of_week === dow)
    const firstRecipe = dayGroup?.recipes?.[0]?.recipe

    if (dayGroup && firstRecipe) {
      result.push({
        dayOfWeek: dow,
        dayName: dayGroup.day_name || DAY_NAMES[dow] || '',
        date: dayGroup.date || '',
        recipeId: firstRecipe.id,
      })
    } else {
      result.push({
        dayOfWeek: dow,
        dayName: DAY_NAMES[dow] || '',
        date: dayGroup?.date || computeDateForDay(menu.week_start, dow),
        recipeId: null,
      })
    }
  }

  return result
}

/**
 * Build the MenuForm payload from current editDays state.
 */
export function buildMenuPayload(
  editDays: EditableDayItem[],
  name: string,
  notes?: string,
): MenuForm {
  const weekStart = editDays[0]?.date || ''
  const weekEnd = editDays[3]?.date || ''

  const items = editDays
    .filter((d) => d.recipeId !== null)
    .map((d) => ({
      day_of_week: d.dayOfWeek,
      menu_date: d.date,
      recipe_id: d.recipeId as number,
      order: 1,
    }))

  return {
    name,
    week_start: weekStart,
    week_end: weekEnd,
    notes,
    items,
  }
}
