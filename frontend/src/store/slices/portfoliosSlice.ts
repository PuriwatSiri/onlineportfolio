import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/services/api'

export interface Portfolio {
  id?: string;
  _id?: string;
  userId: string;
  title: string;
  createDate?: string;
  is_public: boolean; // ให้ตรงกับ backend (snake_case หรือ camelCase ตามที่ตกลง)
  cover_image?: string;
  elements?: any[];
}

interface State { items: Portfolio[]; loading: boolean }
const initial: State = { items: [], loading: false }

// Async Actions
export const fetchPortfolios = createAsyncThunk('portfolios/fetch', async () => await api.getMyPortfolios());
export const createPortfolioAsync = createAsyncThunk('portfolios/create', async (data: any) => await api.createPortfolio(data));
export const updatePortfolioAsync = createAsyncThunk('portfolios/update', async ({id, data}: any) => await api.updatePortfolio(id, data));
export const deletePortfolioAsync = createAsyncThunk('portfolios/delete', async (id: string) => {
    await api.deletePortfolio(id);
    return id;
});

const slice = createSlice({
  name: 'portfolios',
  initialState: initial,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolios.pending, (state) => { state.loading = true; })
      .addCase(fetchPortfolios.fulfilled, (state, action) => { 
          state.loading = false; 
          state.items = action.payload; 
      })
      .addCase(createPortfolioAsync.fulfilled, (state, action) => { state.items.push(action.payload.data || action.payload); }) // เช็ค structure response
      .addCase(updatePortfolioAsync.fulfilled, (state, action) => {
         const idx = state.items.findIndex(p => (p._id || p.id) === (action.payload._id || action.payload.id));
         if(idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(deletePortfolioAsync.fulfilled, (state, action) => {
         state.items = state.items.filter(p => (p._id || p.id) !== action.payload);
      });
  }
})

export default slice.reducer