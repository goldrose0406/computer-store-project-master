export const PRODUCT_CATEGORY_OPTIONS = [
  { label: 'Laptop', value: 'laptop' },
  { label: 'PC Gaming New', value: 'pc-gaming-new' },
  { label: 'PC Gaming Old', value: 'pc-gaming-old' }
];

const LEGACY_LAPTOP_CATEGORIES = new Set([
  'laptop',
  'gaming-laptop',
  'ultrabook',
  'workstation',
  'budget-laptop'
]);

const PRODUCT_CATEGORY_LABEL_MAP = {
  laptop: 'Laptop',
  'pc-gaming-new': 'PC Gaming New',
  'pc-gaming-old': 'PC Gaming Old'
};

export const normalizeProductCategory = (category) => {
  if (!category) {
    return '';
  }

  return LEGACY_LAPTOP_CATEGORIES.has(category) ? 'laptop' : category;
};

export const formatProductCategory = (category) => {
  const normalizedCategory = normalizeProductCategory(category);

  return (
    PRODUCT_CATEGORY_LABEL_MAP[normalizedCategory] ||
    normalizedCategory
      ?.split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  );
};

export const isProductCategoryMatch = (productCategory, expectedCategory) =>
  normalizeProductCategory(productCategory) === normalizeProductCategory(expectedCategory);
