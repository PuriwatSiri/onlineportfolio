import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

type Role = 'user'|'admin'
export interface User { 
  id: string; 
  firstname: string; 
  lastname: string; 
  email: string; 
  role: Role; 
  packageExpire?: string; 
  packageId?: string;
}

interface AuthState { currentUser?: User; loading: boolean }

// helper to normalize user object coming from backend
const normalizeUser = (u: any) => {
  if (!u) return undefined;
  const copy = { ...u };
  if (copy._id && !copy.id) {
    copy.id = copy._id;
  }
  return copy;
};

const storedUser = localStorage.getItem('user');
const initial: AuthState = {
  currentUser: storedUser ? normalizeUser(JSON.parse(storedUser)) : undefined, 
  loading: false
}

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch('http://localhost:5000/api/users/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Invalid token');
    }

    const data = await response.json();
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    login: (state, action: PayloadAction<User>) => { 
      const u = normalizeUser(action.payload);
      state.currentUser = u;
      state.loading = false;
      localStorage.setItem('user', JSON.stringify(u));
    },
    logout: (state) => { 
      state.currentUser = undefined;
      state.loading = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.currentUser) return;
      state.currentUser = { ...state.currentUser, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.currentUser));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.currentUser = normalizeUser(action.payload);
        state.loading = false;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.currentUser = undefined;
        state.loading = false;
      })
  }
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;