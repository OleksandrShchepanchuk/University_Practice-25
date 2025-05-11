// src/store/slices/sessionsSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MoviesSession } from '../../types/movies-session';
import {
  getSessions,
  getSessionById,
  //createSession,
  //updateSession,
  //deleteSession,
} from '../../api/sessions';

// Статус сесій
interface SessionsState {
  sessions: MoviesSession[];
  currentSession: MoviesSession | null;
  loading: boolean;
  error: string | null;
}

const initialState: SessionsState = {
  sessions: [],
  currentSession: null,
  loading: false,
  error: null,
};

// Thunks для асинхронних запитів
export const fetchSessions = createAsyncThunk<MoviesSession[], void, { rejectValue: string }>(
  'sessions/fetchAll',
  async (_, thunkAPI) => {
    try {
      return await getSessions();
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message || 'Failed to load sessions');
    }
  }
);

export const fetchSessionById = createAsyncThunk<MoviesSession, string, { rejectValue: string }>(
  'sessions/fetchById',
  async (id, thunkAPI) => {
    try {
      return await getSessionById(id);
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message || 'Failed to load session');
    }
  }
);

// Слайс для управління станом сесій
const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    clearCurrentSession(state) {
      state.currentSession = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
        state.loading = false;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      })
      .addCase(fetchSessionById.fulfilled, (state, action) => {
        state.currentSession = action.payload;
      });
  },
});

export const { clearCurrentSession } = sessionsSlice.actions;
export default sessionsSlice.reducer;
