import api from '@/api/axios'
import type {
  RecipeListResponse,
  RecipeMutationResponse,
  RecipeDeleteResponse,
  RecipeForm,
  Recipe,
  RecipeDropdownItem,
} from '@/types/recipe'

const BASE = '/admin-sppg/nutrition/recipes'

/**
 * Fetch paginated recipe list with optional filters.
 * GET /api/admin-sppg/nutrition/recipes
 */
export async function getRecipes(params?: {
  page?: number
  per_page?: number
  search?: string
}): Promise<RecipeListResponse> {
  const { data } = await api.get<RecipeListResponse>(BASE, { params })
  return data
}

/**
 * Fetch a single recipe by ID (with ingredients).
 * GET /api/admin-sppg/nutrition/recipes/{id}
 */
export async function getRecipe(id: number): Promise<Recipe> {
  const { data } = await api.get<{ success: boolean; data: Recipe }>(`${BASE}/${id}`)
  return data.data
}

/**
 * Fetch all recipes for dropdown (no pagination).
 * GET /api/admin-sppg/nutrition/recipes/dropdown
 *
 * Backend returns flat fields: { id, name, total_calorie, total_protein, total_weight }
 * We map them into the RecipeDropdownItem shape with a nested `totals` object.
 */
export async function getRecipeDropdown(): Promise<RecipeDropdownItem[]> {
  interface RawDropdownItem {
    id: number
    name: string
    total_calorie: number | null
    total_protein: number | null
    total_carbohydrate: number | null
    total_fat: number | null
    total_weight: number | null
  }

  const { data } = await api.get<{ success: boolean; data: RawDropdownItem[] }>(`${BASE}/dropdown`)

  return data.data.map(raw => ({
    id: raw.id,
    name: raw.name,
    totals: {
      calorie: raw.total_calorie ?? 0,
      protein: raw.total_protein ?? 0,
      carbohydrate: raw.total_carbohydrate ?? 0,
      fat: raw.total_fat ?? 0,
      weight: raw.total_weight ?? 0,
    },
  }))
}

/**
 * Create a new recipe.
 * POST /api/admin-sppg/nutrition/recipes
 */
export async function createRecipe(
  payload: RecipeForm,
): Promise<RecipeMutationResponse> {
  const { data } = await api.post<RecipeMutationResponse>(BASE, payload)
  return data
}

/**
 * Update an existing recipe by ID.
 * PUT /api/admin-sppg/nutrition/recipes/{id}
 */
export async function updateRecipe(
  id: number,
  payload: RecipeForm,
): Promise<RecipeMutationResponse> {
  const { data } = await api.put<RecipeMutationResponse>(`${BASE}/${id}`, payload)
  return data
}

/**
 * Delete a recipe by ID.
 * DELETE /api/admin-sppg/nutrition/recipes/{id}
 */
export async function deleteRecipe(id: number): Promise<RecipeDeleteResponse> {
  const { data } = await api.delete<RecipeDeleteResponse>(`${BASE}/${id}`)
  return data
}
