export interface InventoryItem {
  id: string;
  name: string;
  batchNumber: string;
  daysUntilExpiry: number;
  imageUrl: string;
  quantity: number;
  category: string;
  vendor: string;
  storageLocation: string;
  inStock: boolean;
  similarItems?: string[];
}

interface OpenFoodFactsProduct {
  product_name: string;
  image_url: string;
  categories: string;
  brands: string;
  quantity: string;
  image_front_url: string;
}

export interface SearchFilters {
  category?: string;
  storageLocation?: string;
  inStock?: boolean;
  minQuantity?: number;
  maxDaysUntilExpiry?: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Fallback items in case API fails
export const groceryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Lettuce',
    category: 'vegetables',
    vendor: 'local_farm',
    storageLocation: 'refrigerator',
    batchNumber: 'B001',
    quantity: 5,
    daysUntilExpiry: 7,
    inStock: true,
    imageUrl: '/images/food/lettuce.jpg',
    similarItems: ['Iceberg Lettuce', 'Romaine Lettuce', 'Green Lettuce', 'Red Lettuce']
  },
  {
    id: '2',
    name: 'Milk',
    category: 'dairy',
    vendor: 'dairy_farm',
    storageLocation: 'refrigerator',
    batchNumber: 'B002',
    quantity: 2,
    daysUntilExpiry: 5,
    inStock: true,
    imageUrl: '/images/food/milk.jpg',
    similarItems: ['Whole Milk', 'Skim Milk', '2% Milk', '1% Milk']
  },
  {
    id: '3',
    name: 'Rice',
    category: 'grains',
    vendor: 'grocery_store',
    storageLocation: 'pantry',
    batchNumber: 'B003',
    quantity: 10,
    daysUntilExpiry: 365,
    inStock: true,
    imageUrl: '/images/food/rice.jpg',
    similarItems: ['White Rice', 'Brown Rice', 'Long Grain Rice', 'Short Grain Rice']
  },
  {
    id: '4',
    name: 'Cheese',
    category: 'dairy',
    vendor: 'dairy_farm',
    storageLocation: 'refrigerator',
    batchNumber: 'B004',
    quantity: 3,
    daysUntilExpiry: 14,
    inStock: true,
    imageUrl: '/images/food/cheese.jpg',
    similarItems: ['Cheddar', 'Mozzarella', 'Swiss', 'Provolone']
  },
  {
    id: '5',
    name: 'Chicken',
    category: 'meat',
    vendor: 'local_butcher',
    storageLocation: 'freezer',
    batchNumber: 'B005',
    quantity: 4,
    daysUntilExpiry: 30,
    inStock: true,
    imageUrl: '/images/food/chicken.jpg',
    similarItems: ['Whole Chicken', 'Chicken Breast', 'Chicken Thighs', 'Chicken Wings']
  },
  {
    id: '6',
    name: 'Apples',
    category: 'fruits',
    vendor: 'local_orchard',
    storageLocation: 'refrigerator',
    batchNumber: 'B006',
    quantity: 12,
    daysUntilExpiry: 14,
    inStock: true,
    imageUrl: '/images/food/apples.jpg',
    similarItems: ['Red Apples', 'Green Apples', 'Yellow Apples', 'Pink Apples']
  },
  {
    id: '7',
    name: 'Bread',
    category: 'bakery',
    vendor: 'local_bakery',
    storageLocation: 'pantry',
    batchNumber: 'B007',
    quantity: 2,
    daysUntilExpiry: 5,
    inStock: true,
    imageUrl: '/images/food/bread.jpg',
    similarItems: ['White Bread', 'Wheat Bread', 'Rye Bread', 'Sourdough']
  },
  {
    id: '8',
    name: 'Eggs',
    category: 'dairy',
    vendor: 'local_farm',
    storageLocation: 'refrigerator',
    batchNumber: 'B008',
    quantity: 18,
    daysUntilExpiry: 14,
    inStock: true,
    imageUrl: '/images/food/eggs.jpg',
    similarItems: ['Large Eggs', 'Medium Eggs', 'Small Eggs', 'Extra Large Eggs']
  },
  {
    id: '9',
    name: 'Tomatoes',
    category: 'vegetables',
    vendor: 'local_farm',
    storageLocation: 'refrigerator',
    batchNumber: 'B009',
    quantity: 8,
    daysUntilExpiry: 7,
    inStock: true,
    imageUrl: '/images/food/tomatoes.jpg',
    similarItems: ['Red Tomatoes', 'Green Tomatoes', 'Yellow Tomatoes', 'Cherry Tomatoes']
  },
  {
    id: '10',
    name: 'Pasta',
    category: 'grains',
    vendor: 'grocery_store',
    storageLocation: 'pantry',
    batchNumber: 'B010',
    quantity: 5,
    daysUntilExpiry: 365,
    inStock: true,
    imageUrl: '/images/food/pasta.jpg',
    similarItems: ['Spaghetti', 'Penne', 'Macaroni', 'Fettuccine']
  },
  {
    id: '11',
    name: 'Yogurt',
    category: 'dairy',
    vendor: 'dairy_farm',
    storageLocation: 'refrigerator',
    batchNumber: 'B011',
    quantity: 4,
    daysUntilExpiry: 7,
    inStock: true,
    imageUrl: '/images/food/yogurt.jpg',
    similarItems: ['Plain Yogurt', 'Vanilla Yogurt', 'Strawberry Yogurt', 'Blueberry Yogurt']
  },
  {
    id: '12',
    name: 'Carrots',
    category: 'vegetables',
    vendor: 'local_farm',
    storageLocation: 'refrigerator',
    batchNumber: 'B012',
    quantity: 10,
    daysUntilExpiry: 14,
    inStock: true,
    imageUrl: '/images/food/carrots.jpg',
    similarItems: ['Orange Carrots', 'Purple Carrots', 'Yellow Carrots', 'White Carrots']
  }
];

const generateBatchNumber = () => {
  return `BATCH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

const generateDaysUntilExpiry = () => {
  return Math.floor(Math.random() * 14) + 1;
};

const generateQuantity = () => {
  return Math.floor(Math.random() * 50) + 1;
};

const ITEMS_PER_PAGE = 12;
const MAX_CACHE_AGE = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  items: InventoryItem[];
  timestamp: number;
}

let foodItemsCache: CacheEntry | null = null;

const mapCategory = (categories: string): string => {
  const categoryMap: { [key: string]: string } = {
    'dairy': 'dairy',
    'meat': 'meat',
    'fish': 'meat',
    'seafood': 'meat',
    'vegetables': 'vegetables',
    'fruits': 'fruits',
    'bakery': 'bakery',
    'pasta': 'grains',
    'rice': 'grains',
    'cereals': 'grains',
    'snacks': 'snacks',
    'beverages': 'beverages',
    'condiments': 'condiments',
    'spices': 'spices',
    'sauces': 'condiments',
    'frozen': 'frozen',
    'canned': 'canned',
    'dried': 'pantry',
    'pantry': 'pantry',
    'desserts': 'desserts',
    'soups': 'soups',
    'prepared': 'prepared',
    'organic': 'organic',
    'gluten-free': 'specialty',
    'vegan': 'specialty',
    'vegetarian': 'specialty',
    'kosher': 'specialty',
    'halal': 'specialty'
  };

  const lowerCategories = categories.toLowerCase();
  for (const [key, value] of Object.entries(categoryMap)) {
    if (lowerCategories.includes(key)) {
      return value;
    }
  }
  return 'other';
};

const determineStorageLocation = (category: string): string => {
  const storageMap: { [key: string]: string } = {
    'dairy': 'refrigerator',
    'meat': 'freezer',
    'vegetables': 'refrigerator',
    'fruits': 'refrigerator',
    'bakery': 'pantry',
    'grains': 'pantry',
    'snacks': 'pantry',
    'beverages': 'refrigerator',
    'condiments': 'refrigerator',
    'spices': 'pantry',
    'frozen': 'freezer',
    'canned': 'pantry',
    'pantry': 'pantry',
    'desserts': 'freezer',
    'soups': 'pantry',
    'prepared': 'refrigerator',
    'organic': 'refrigerator',
    'specialty': 'pantry',
    'other': 'pantry'
  };
  return storageMap[category] || 'pantry';
};

const fetchFoodItems = async (): Promise<InventoryItem[]> => {
  try {
    // Fetch from Open Food Facts API with increased page size
    const response = await fetch('https://world.openfoodfacts.org/cgi/search.pl?search_terms=*&json=1&page_size=500');
    const data = await response.json();
    
    if (!data.products) {
      throw new Error('No products found in API response');
    }

    // Transform API data into our InventoryItem format
    const items: InventoryItem[] = data.products.map((product: OpenFoodFactsProduct, index: number) => ({
      id: (index + 1).toString(),
      name: product.product_name || 'Unknown Product',
      batchNumber: generateBatchNumber(),
      daysUntilExpiry: generateDaysUntilExpiry(),
      imageUrl: '/images/food/placeholder.jpg', // Use local placeholder image
      quantity: generateQuantity(),
      category: mapCategory(product.categories || ''),
      vendor: product.brands || 'Unknown Brand',
      storageLocation: determineStorageLocation(mapCategory(product.categories || '')),
      inStock: true,
      similarItems: [] // We'll populate this in the search function
    }));

    return items;
  } catch (error) {
    console.error('Error fetching food items:', error);
    return groceryItems;
  }
};

const isCacheValid = (cache: CacheEntry): boolean => {
  return Date.now() - cache.timestamp < MAX_CACHE_AGE;
};

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  // Return cached items if available and valid
  if (foodItemsCache && isCacheValid(foodItemsCache)) {
    return foodItemsCache.items;
  }

  // Fetch new items
  const items = await fetchFoodItems();
  foodItemsCache = {
    items,
    timestamp: Date.now()
  };
  return items;
};

const applyFilters = (items: InventoryItem[], filters: SearchFilters): InventoryItem[] => {
  return items.filter(item => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.storageLocation && item.storageLocation !== filters.storageLocation) return false;
    if (filters.inStock !== undefined && item.inStock !== filters.inStock) return false;
    if (filters.minQuantity !== undefined && item.quantity < filters.minQuantity) return false;
    if (filters.maxDaysUntilExpiry !== undefined && item.daysUntilExpiry > filters.maxDaysUntilExpiry) return false;
    return true;
  });
};

const paginateItems = (items: InventoryItem[], params: PaginationParams): PaginatedResponse<InventoryItem> => {
  const startIndex = (params.page - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);
  
  return {
    items: paginatedItems,
    total: items.length,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(items.length / params.pageSize)
  };
};

export const searchInventoryItems = async (
  query: string,
  filters: SearchFilters = {},
  pagination: PaginationParams = { page: 1, pageSize: ITEMS_PER_PAGE }
): Promise<PaginatedResponse<InventoryItem>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const searchQuery = query.toLowerCase().trim();
  
  // Get all items
  const allItems = await getInventoryItems();

  // Apply filters first
  const filteredItems = applyFilters(allItems, filters);

  // If no search query, return filtered and paginated results
  if (!searchQuery) {
    return paginateItems(filteredItems, pagination);
  }

  // Calculate similarity score between search query and item name
  const getSimilarityScore = (itemName: string): number => {
    const name = itemName.toLowerCase();
    const queryLength = searchQuery.length;
    
    // Check if the search query is at the start of the name
    if (name.startsWith(searchQuery)) return 3;
    
    // Check if the search query is contained within the name
    if (name.includes(searchQuery)) return 2;
    
    // Check if the first few letters match
    const firstLettersMatch = name.slice(0, queryLength) === searchQuery;
    if (firstLettersMatch) return 1;
    
    return 0;
  };

  // Get all items with similarity scores
  const itemsWithScores = filteredItems.map(item => ({
    ...item,
    similarityScore: getSimilarityScore(item.name)
  }));

  // Filter out items with no similarity and sort by score
  const matchedItems = itemsWithScores
    .filter(item => item.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore);

  return paginateItems(matchedItems, pagination);
};

export const getCategories = (): string[] => {
  return [
    'dairy', 'meat', 'vegetables', 'fruits', 'bakery', 'grains',
    'snacks', 'beverages', 'condiments', 'spices', 'frozen', 'canned',
    'pantry', 'desserts', 'soups', 'prepared', 'organic', 'specialty'
  ];
};

export const getStorageLocations = (): string[] => {
  return ['refrigerator', 'freezer', 'pantry'];
}; 