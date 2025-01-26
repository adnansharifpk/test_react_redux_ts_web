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
      fetchProductsIfNeeded();
    }, 500); 
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const fetchProductsIfNeeded = async () => {
    if (!searchTermRef.current.trim() || isFetchingRef.current) return;
    if (
      searchTermRef.current === lastCallParamsRef.current.searchTerm &&
      orderBy === lastCallParamsRef.current.orderBy &&
      sortDirection === lastCallParamsRef.current.sortDirection
    ) {
      return;
    }

    lastCallParamsRef.current = { searchTerm: searchTermRef.current, orderBy, sortDirection };
    isFetchingRef.current = true;
    try {
      await dispatch(fetchProducts({ searchTerm: searchTermRef.current, orderBy, sortDirection }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      fetchProductsIfNeeded();
    }
  }, [orderBy, sortDirection, dispatch, searchTerm]);

  useEffect(() => {
    if (error) {
      toast.error('An error occurred. ' + error);
    }
  }, [error]);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  useEffect(() => {
    if (searchTerm.trim() || orderBy || sortDirection) {
      dispatch(setSessionData({ searchTerm, orderBy, sortDirection }));
    }
  }, [searchTerm, orderBy, sortDirection, dispatch]);

  const handleSort = (column: string) => {
    if (orderBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(column);
      setSortDirection('asc');
    }
  };

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
      if (error instanceof Error) {
        throw new Error('Failed to update selection: ' + error.message);
      } else {
        // If error is not an instance of Error, handle it differently
        throw new Error('Failed to update selection.');
      }
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
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>ID</th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name</th>
              <th onClick={() => handleSort('description')} style={{ cursor: 'pointer' }}>Description</th>
              <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>Price</th>
              <th onClick={() => handleSort('stock')} style={{ cursor: 'pointer' }}>Stock</th>
              <th onClick={() => handleSort('selected')} style={{ cursor: 'pointer' }}>Select</th>
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