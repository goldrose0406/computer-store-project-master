const PRODUCT_CATEGORY_OPTIONS = [
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

const normalizeProductCategory = (category) => {
  if (!category) {
    return '';
  }

  return LEGACY_LAPTOP_CATEGORIES.has(category) ? 'laptop' : category;
};

const getCategoryFilterValues = (category) => {
  const normalizedCategory = normalizeProductCategory(category);

  if (normalizedCategory === 'laptop') {
    return Array.from(LEGACY_LAPTOP_CATEGORIES);
  }

  return [normalizedCategory];
};

const formatProductCategory = (category) => {
  const normalizedCategory = normalizeProductCategory(category);

  return (
    PRODUCT_CATEGORY_LABEL_MAP[normalizedCategory] ||
    normalizedCategory
      ?.split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  );
};

module.exports = {
  PRODUCT_CATEGORY_OPTIONS,
  LEGACY_LAPTOP_CATEGORIES,
  normalizeProductCategory,
  getCategoryFilterValues,
  formatProductCategory
};
