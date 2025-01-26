import api from '../../utils/apiInterceptor'; // Import the shared API instance

// Define the FetchProductsParams interface
export interface FetchProductsParams {
  searchTerm: string;
  orderBy: string;
  sortDirection: 'asc' | 'desc';
}

// Define the async function for fetching products
export const fetchProducts = async ({
  searchTerm,
  orderBy,
  sortDirection,
}: FetchProductsParams) => {
  try {
    const response = await api.get('/api/products/', {
      params: {
        name: searchTerm,
        order_by: orderBy,
        sort_direction: sortDirection,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

// Define the interface for updating product selection
interface UpdateProductSelectionParams {
    productId: number;
    selected: boolean;
  }
  
  // Define the async function for updating product selection
  export const updateProductSelection = async ({
    productId,
    selected,
  }: UpdateProductSelectionParams) => {
    try {
      const response = await api.patch(`/api/product/select/${productId}/`, {
        selected: selected,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product selection:', error);
      throw new Error('Failed to update product selection');
    }
  };