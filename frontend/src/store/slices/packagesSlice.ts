import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/services/api' // ตรวจสอบ path api ให้ถูกต้อง

export interface Package { 
    id?: string; 
    _id?: string; 
    package_name: string; 
    price: number; 
    duration: number; 
    package_detail: string; 
}

interface State { items: Package[]; loading: boolean; error: string | null }
const initial: State = { items: [], loading: false, error: null }

// Actions สำหรับเรียก API
export const fetchPackages = createAsyncThunk('packages/fetch', async () => await api.getPackages());
export const addPackageAsync = createAsyncThunk('packages/add', async (data: Package) => await api.createPackage(data));
export const updatePackageAsync = createAsyncThunk('packages/update', async ({id, data}: {id: string, data: Package}) => await api.updatePackage(id, data));
export const deletePackageAsync = createAsyncThunk('packages/delete', async (id: string) => {
    await api.deletePackage(id);
    return id;
});

const slice = createSlice({
  name: 'packages',
  initialState: initial,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => { state.loading = true; })
      .addCase(fetchPackages.fulfilled, (state, action) => { 
          state.loading = false; 
          state.items = action.payload; 
      })
      .addCase(fetchPackages.rejected, (state, action) => { 
          state.loading = false; 
          state.error = action.error.message || 'Failed'; 
      })
      .addCase(addPackageAsync.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updatePackageAsync.fulfilled, (state, action) => {
         const idx = state.items.findIndex(p => (p._id || p.id) === (action.payload._id || action.payload.id));
         if(idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(deletePackageAsync.fulfilled, (state, action) => {
         state.items = state.items.filter(p => (p._id || p.id) !== action.payload);
      });
  }
})

export default slice.reducer