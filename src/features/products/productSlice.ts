import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts as fetchProductsAPI, FetchProductsParams, updateProductSelection } from './productAPI';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  selected: boolean;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// Async thunk
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: FetchProductsParams) => {
    const response = await fetchProductsAPI(params);
    return response; // Resolve payload directly from API
  }
);

// Action to update product selection
export const updateProductSelectionAction = createAsyncThunk(
  'products/updateSelection',
  async ({ productId, selected }: { productId: number, selected: boolean }) => {
    try {
      const response = await updateProductSelection({ productId, selected });
      return response; // Return the response data if needed
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Failed to update product selection: ' + error.message);
      } else {
        // If error is not an instance of Error, handle it differently
        throw new Error('Failed to update product selection: Unknown error occurred');
      }
    }
  }
);

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export default productSlice.reducer;
