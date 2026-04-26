import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/services/api'

export interface Payment { 
    _id?: string; 
    user_id: any; 
    amount: number; 
    created_at?: string; 
    status: string; 
    transfer_time?: string; 
    payment_slip?: string 
}

interface State { items: Payment[] }
const initial: State = { items: [] }

export const fetchPayments = createAsyncThunk('payments/fetch', async () => await api.getPayments());
export const createPaymentAsync = createAsyncThunk('payments/create', async (data: any) => await api.createPayment(data));
export const fetchPaymentById = createAsyncThunk('payments/fetchOne', async (id: string) => await api.getPaymentById(id));
export const fetchMyPayments = createAsyncThunk('payments/fetchMine', async () => await api.getMyPayments());
export const updatePaymentStatusAsync = createAsyncThunk('payments/updateStatus', async ({id, status}: any) => await api.updatePaymentStatus(id, status));

const slice = createSlice({
  name: 'payments',
  initialState: initial,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPayments.fulfilled, (state, action) => { state.items = action.payload });
    builder.addCase(fetchMyPayments.fulfilled, (state, action) => { state.items = action.payload });
    builder.addCase(createPaymentAsync.fulfilled, (state, action) => { state.items.push(action.payload) });
    builder.addCase(fetchPaymentById.fulfilled, (state, action) => {
        // replace if exists else push
        const idx = state.items.findIndex(p => p._id === action.payload._id);
        if(idx >= 0) state.items[idx] = action.payload;
        else state.items.push(action.payload);
    });
    builder.addCase(updatePaymentStatusAsync.fulfilled, (state, action) => {
        const idx = state.items.findIndex(p => p._id === action.payload._id);
        if(idx >= 0) state.items[idx] = action.payload;
    });
  }
})

export default slice.reducer