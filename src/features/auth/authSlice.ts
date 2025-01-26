import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, logoutApi } from './authAPI';
import axios from 'axios';

interface AuthState {
  user: null | { email: string };
  token: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
  sessionData: {
    searchTerm: string;
    orderBy: string;
    sortDirection: 'asc' | 'desc';
  } | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('What.AG.Test.authData') || '{}').user || null,
  token: JSON.parse(localStorage.getItem('What.AG.Test.authData') || '{}').token || null,
  refresh: JSON.parse(localStorage.getItem('What.AG.Test.authData') || '{}').refresh || null,
  isAuthenticated: localStorage.getItem('What.AG.Test.authData') ? true : false,
  sessionData: JSON.parse(localStorage.getItem('What.AG.Test.authData') || '{}').sessionData || null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string, password: string }, { rejectWithValue }) => {
    try {
      const data = await loginApi(credentials);

      if (data.access) {
        const user = { email: credentials.email };
        return { user, token: data.access, refresh: data.refresh };
      }

      return rejectWithValue('Access token not found in response.');
    } catch (error: unknown) {
      if (error instanceof axios.AxiosError) {
        return rejectWithValue(error.response?.data?.detail || 'Something went wrong');
      }
      return rejectWithValue('Something went wrong');
    }
  }
);

// logout function to call and remove local session in any case even if backend throws error.
export const logout = createAsyncThunk('auth/logout', async () => {
  const authData = JSON.parse(localStorage.getItem('What.AG.Test.authData') || '{}');
  const refresh = authData.refresh || null;

  try {
    if (refresh) {
      await logoutApi(refresh);
    }
  } catch (error) {
    console.error('Error during logout API call:', error);
    // Log the error but allow the process to continue
  }
  // Always return success outside the try-catch-finally
  return { success: true };
});



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSessionData(state, action) {
      state.sessionData = action.payload;
      localStorage.setItem('What.AG.Test.authData', JSON.stringify({
        token: state.token,
        refresh: state.refresh,
        user: state.user,
        sessionData: state.sessionData,
      }));
    },
    clearSessionData(state) {
      state.sessionData = null;
      localStorage.setItem('What.AG.Test.authData', JSON.stringify({
        token: state.token,
        user: state.user,
        refresh: state.refresh,
        sessionData: null,
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refresh = action.payload.refresh;
        state.isAuthenticated = true;
        localStorage.setItem('What.AG.Test.authData', JSON.stringify({ 
          token: state.token, 
          user: state.user, 
          refresh: state.refresh,
          sessionData: state.sessionData, 
        }));
      })
      .addCase(login.rejected, (state) => {
        // Ensure authentication state remains false on login failure
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refresh = null;
        state.isAuthenticated = false;
        state.sessionData = null;
        localStorage.removeItem('What.AG.Test.authData');
      });
  },
});


export const { setSessionData, clearSessionData } = authSlice.actions;
export default authSlice.reducer;
