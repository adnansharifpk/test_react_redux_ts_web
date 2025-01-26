import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, updateProductSelectionAction } from '../../features/products/productSlice';
import { RootState, AppDispatch } from '../../store';
import './styles/Product.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setSessionData } from '../../features/auth/authSlice'; // Import the action

const Product = () => {
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.products);
  const loading = useSelector((state: RootState) => state.products.loading);
  const error = useSelector((state: RootState) => state.products.error);
  const sessionData = useSelector((state: RootState) => state.auth.sessionData);

  const [searchTerm, setSearchTerm] = useState(sessionData?.searchTerm || '');
  const [orderBy, setOrderBy] = useState(sessionData?.orderBy || 'name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(sessionData?.sortDirection || 'asc');
  const [localProducts, setLocalProducts] = useState(products);

  const searchTermRef = useRef(searchTerm);
  const isFetchingRef = useRef(false);
  const lastCallParamsRef = useRef<{ searchTerm: string; orderBy: string; sortDirection: string }>({
    searchTerm: '',
    orderBy: 'name',
    sortDirection: 'asc',
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchTermRef.current = searchTerm;
      if (searchTerm.trim()) {
        fetchProductsIfNeeded();
      } else {
        // Clear products and session data when search term is empty
        setLocalProducts([]);
        dispatch(setSessionData({ searchTerm: '', orderBy: 'name', sortDirection: 'asc' }));
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const fetchProductsIfNeeded = async () => {
    if (isFetchingRef.current) return; // Prevent fetch if already in progress
    if (!searchTermRef.current.trim()) return; // Don't fetch if search term is empty or only spaces
    console.log("searchTermRef.current "+searchTermRef.current+" orderBy "+ orderBy+ " sortDirection "+sortDirection)
    if (
      searchTermRef.current === lastCallParamsRef.current.searchTerm &&
      orderBy === lastCallParamsRef.current.orderBy &&
      sortDirection === lastCallParamsRef.current.sortDirection
    ) {
      return; // No need to fetch if parameters haven't changed
    }

    lastCallParamsRef.current = { searchTerm: searchTermRef.current, orderBy, sortDirection };
    isFetchingRef.current = true;
    try {
      // Fetch the products with the correct sorting parameters
      await dispatch(fetchProducts({ searchTerm: searchTermRef.current, orderBy, sortDirection }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (searchTerm.trim() || orderBy || sortDirection) {
      dispatch(setSessionData({ searchTerm, orderBy, sortDirection }));
    }
  }, [searchTerm, orderBy, sortDirection, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error('An error occurred. ' + error);
    }
  }, [error]);

  useEffect(() => {
    // Make sure localProducts is updated correctly from fetched products
    setLocalProducts(products);
  }, [products]);

  const handleSort = (column: string) => {
  if (orderBy === column) {
    // If the column is already sorted, toggle the sort direction
    const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newSortDirection);  // Update sort direction
  } else {
    // If the column is new, set it to ascending order
    setOrderBy(column);
    setSortDirection('asc');  // Set to ascending by default
  }
};

// Call fetchProductsIfNeeded in a useEffect hook to ensure it is triggered after sort state change
useEffect(() => {
  if (orderBy && sortDirection) {
    fetchProductsIfNeeded();
  }
}, [orderBy, sortDirection]); // Dependency on orderBy and sortDirection

  const handleSelectProduct = async (productId: number, selected: boolean) => {
    try {
      const result = await dispatch(updateProductSelectionAction({ productId, selected }));
      if (result.payload) {
        setLocalProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId ? { ...product, selected } : product
          )
        );
      }
    } catch (error) {
      console.error('Failed to update selection:', error);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer autoClose={5000} newestOnTop closeOnClick closeButton={false} draggable pauseOnHover />
      <div className="row mb-3" style={{ paddingTop: '20px' }}>
        <div className="col-md-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products"
            className="form-control"
          />
        </div>
      </div>

      {loading && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                ID {orderBy === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Name {orderBy === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('description')} style={{ cursor: 'pointer' }}>
                Description {orderBy === 'description' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                Price {orderBy === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('stock')} style={{ cursor: 'pointer' }}>
                Stock {orderBy === 'stock' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('selected')} style={{ cursor: 'pointer' }}>
                Select {orderBy === 'selected' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {localProducts.length > 0 ? (
              localProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={product.selected}
                      onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;
