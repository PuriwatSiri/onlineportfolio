import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/services/api'

export interface Issue {
  _id?: string;
  issueId?: string;
  title: string;
  description: string;
  status: string;
  report_date?: string;
  note?: string;
  user_id?: any;
}

interface State { items: Issue[] }
const initial: State = { items: [] }

export const fetchIssues = createAsyncThunk('issues/fetch', async () => await api.getIssues());
export const fetchMyIssues = createAsyncThunk('issues/fetchMine', async () => await api.getMyIssues());
export const reportIssueAsync = createAsyncThunk('issues/report', async (data: any) => await api.reportIssue(data));
export const updateIssueAsync = createAsyncThunk('issues/update', async ({ id, data }: any) => await api.updateIssue(id, data));

const slice = createSlice({
  name: 'issues',
  initialState: initial,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIssues.fulfilled, (state, action) => { state.items = action.payload });
    builder.addCase(fetchMyIssues.fulfilled, (state, action) => { state.items = action.payload });
    builder.addCase(reportIssueAsync.fulfilled, (state, action) => { state.items.push(action.payload) });
    builder.addCase(updateIssueAsync.fulfilled, (state, action) => {
      const idx = state.items.findIndex(i => i._id === action.payload._id);
      if (idx >= 0) state.items[idx] = action.payload;
    });
  }
})

export default slice.reducer