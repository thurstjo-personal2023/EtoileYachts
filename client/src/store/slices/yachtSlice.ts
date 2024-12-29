import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { YachtDetails } from '@/lib/types/yacht';

interface YachtState {
  yachts: YachtDetails[];
  selectedYacht: YachtDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: YachtState = {
  yachts: [],
  selectedYacht: null,
  loading: false,
  error: null,
};

export const fetchYachts = createAsyncThunk(
  'yachts/fetchYachts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/yachts', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch yachts');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchYachtDetails = createAsyncThunk(
  'yachts/fetchYachtDetails',
  async (yachtId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/yachts/${yachtId}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch yacht details');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const yachtSlice = createSlice({
  name: 'yachts',
  initialState,
  reducers: {
    clearYachtError: (state) => {
      state.error = null;
    },
    setSelectedYacht: (state, action: PayloadAction<YachtDetails | null>) => {
      state.selectedYacht = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchYachts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYachts.fulfilled, (state, action: PayloadAction<YachtDetails[]>) => {
        state.loading = false;
        state.yachts = action.payload;
      })
      .addCase(fetchYachts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchYachtDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYachtDetails.fulfilled, (state, action: PayloadAction<YachtDetails>) => {
        state.loading = false;
        state.selectedYacht = action.payload;
      })
      .addCase(fetchYachtDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearYachtError, setSelectedYacht } = yachtSlice.actions;
export default yachtSlice.reducer;
