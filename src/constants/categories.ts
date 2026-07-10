export const CATEGORIES = ['Semua', 'Sale', 'Semi Premium', 'Semi Original', 'Superclone', 'Unbranded'] as const;
export type CategoryWithAll = typeof CATEGORIES[number];

export const CATEGORIES_NO_ALL: readonly ['Sale', 'Semi Premium', 'Semi Original', 'Superclone', 'Unbranded'] =
  CATEGORIES.slice(1) as ['Sale', 'Semi Premium', 'Semi Original', 'Superclone', 'Unbranded'];
export type Category = typeof CATEGORIES_NO_ALL[number];
