// src/store/slices/sessions.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MoviesSession } from '../../types/movies-session';

interface SessionsState {
  sessions: MoviesSession[];
  loading: boolean;
}

const initialState: SessionsState = {
  sessions: [],
  loading: false,
};

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setSessions(state, action: PayloadAction<MoviesSession[]>) {
      state.sessions = action.payload;
    },
    setSessionsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setSessions, setSessionsLoading } = sessionsSlice.actions;
export default sessionsSlice.reducer;
