import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
// อย่าลืมตรวจสอบว่าไฟล์นี้มีอยู่จริงและ exportฟังก์ชัน api ให้ครบนะครับ
import { api } from '@/services/api' 

// 1. Export Interface
export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'rect' | 'circle' | 'triangle' | 'line' | 'icon' | 'divider';
  content?: string;
  iconName?: string;
  style: {
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    rotation?: number;
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: number;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    textAlign?: string;
    zIndex?: number;
    opacity?: number;
    boxShadow?: string;
    letterSpacing?: number;
    lineHeight?: number;
  };
}

export interface Template {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  backgroundColor?: string;
  preview?: string;
  thumbnail?: string;
  description?: string;
  releaseDate?: string;
  active: boolean;
  elements?: CanvasElement[]; 
  pages?: CanvasElement[][];  
  page_backgrounds?: string[];
  usageCount?: number;
}

interface State {
  items: Template[]
  filter: string
  loading: boolean
  error: string | null
}

// --- Async Thunks ---

export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      // คาดหวังว่า api.getTemplates() จะ return Array ของ Template
      return await api.getTemplates();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch templates');
    }
  }
);

export const createTemplateAsync = createAsyncThunk(
  'templates/createTemplate',
  async (data: Template, { rejectWithValue }) => {
    try {
      return await api.createTemplate(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create template');
    }
  }
);

export const updateTemplateAsync = createAsyncThunk(
  'templates/updateTemplate',
  async ({ id, data }: { id: string; data: Template }, { rejectWithValue }) => {
    try {
      return await api.updateTemplate(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update template');
    }
  }
);

export const deleteTemplateAsync = createAsyncThunk(
  'templates/deleteTemplate',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteTemplate(id);
      return id; // ส่ง id กลับมาเพื่อลบออกจาก state
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete template');
    }
  }
);

// --- Initial State ---

// ปรับให้ items เริ่มต้นเป็นว่าง เพื่อรอรับข้อมูลจริงจาก API เท่านั้น
// (ลบ demo data ออกเพื่อป้องกันความสับสนในหน้า Admin)
const initial: State = { 
  items: [], 
  filter: '', 
  loading: false, 
  error: null 
}

// --- Slice ---

const slice = createSlice({
  name: 'templates',
  initialState: initial,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => { state.filter = action.payload },
    
    // Actions สำหรับจัดการ State แบบ Manual (ถ้าจำเป็น)
    addTemplate: (state, action: PayloadAction<Template>) => { state.items.push(action.payload) },
    updateTemplate: (state, action: PayloadAction<Template>) => {
      const i = state.items.findIndex(t => (t.id === action.payload.id || t._id === action.payload._id))
      if (i >= 0) state.items[i] = { ...state.items[i], ...action.payload }
    },
    removeTemplate: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload && t._id !== action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        // แทนที่ items ด้วยข้อมูลจริงจาก DB
        state.items = action.payload || []; 
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createTemplateAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTemplateAsync.fulfilled, (state, action) => {
        state.loading = false;
        // เพิ่มข้อมูลใหม่ที่ได้จาก DB เข้าไปใน list
        state.items.push(action.payload);
      })
      .addCase(createTemplateAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateTemplateAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTemplateAsync.fulfilled, (state, action) => {
        state.loading = false;
        const i = state.items.findIndex(t => t.id === action.payload.id || t._id === action.payload._id);
        if (i >= 0) state.items[i] = action.payload;
      })
      .addCase(updateTemplateAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteTemplateAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload && t._id !== action.payload);
      })
      .addCase(deleteTemplateAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
})

export const { setFilter, addTemplate, updateTemplate, removeTemplate } = slice.actions
export default slice.reducer