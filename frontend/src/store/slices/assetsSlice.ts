import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Asset {
  id: string;
  filename: string;
  size: number;
  type: string;
  hash: string;
  uploadedAt: string;
}

export interface Detection {
  platform: string;
  url: string;
  confidence: number;
  timestamp: string;
  status: 'Authorized' | 'Unauthorized';
}

export interface TrackingResult {
  hash: string;
  detections: Detection[];
  totalDetections: number;
  unauthorizedCount: number;
}

interface AssetsState {
  assets: Asset[];
  trackingResults: { [hash: string]: TrackingResult };
  loading: boolean;
  error: string | null;
}

const initialState: AssetsState = {
  assets: [],
  trackingResults: {},
  loading: false,
  error: null,
};

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    addAsset: (state, action: PayloadAction<Asset>) => {
      state.assets.push(action.payload);
    },
    setTrackingResult: (state, action: PayloadAction<TrackingResult>) => {
      state.trackingResults[action.payload.hash] = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { addAsset, setTrackingResult, setLoading, setError } = assetsSlice.actions;
export default assetsSlice.reducer;