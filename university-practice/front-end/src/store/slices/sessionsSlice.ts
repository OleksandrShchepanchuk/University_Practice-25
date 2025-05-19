// src/store/slices/sessionsSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MoviesSession } from '../../types/movies-session';
import {
    getSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
} from '../../api/sessions';

interface SessionsState {
    list: MoviesSession[];
    loading: boolean;
    error: string | null;
    hasLoaded: boolean;
}

const initialState: SessionsState = {
    list: [],
    loading: false,
    error: null,
    hasLoaded: false,
};

export const loadSessions = createAsyncThunk<MoviesSession[], void, { rejectValue: string }>(
    'sessions/fetchAll',
    async (_, thunkAPI) => {
        try {
            return await getSessions();
        } catch (err) {
            return thunkAPI.rejectWithValue((err as Error).message || 'Failed to load sessions');
        }
    },
);

export const addSession = createAsyncThunk<MoviesSession, MoviesSession, { rejectValue: string }>(
  'sessions/add',
  async (session, thunkAPI) => {
    try {
      return await createSession(session);
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message || 'Failed to add session');
    }
  }
);

export const editSession = createAsyncThunk<
  MoviesSession,
  { id: string; session: Partial<MoviesSession> },
  { rejectValue: string }
>('sessions/edit', async ({ id, session }, thunkAPI) => {
  try {
    return await updateSession(id, session);
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message || 'Failed to update session');
  }
});

export const removeSession = createAsyncThunk<string, string, { rejectValue: string }>(
  'sessions/remove',
  async (id, thunkAPI) => {
    try {
      await deleteSession(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message || 'Failed to delete session');
    }
  }
);


const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSessions.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
        state.hasLoaded = true;
      })
      .addCase(loadSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      })

      .addCase(addSession.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      .addCase(editSession.fulfilled, (state, action) => {
        const index = state.list.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      .addCase(removeSession.fulfilled, (state, action) => {
        state.list = state.list.filter(s => s.id !== action.payload);
      });
  },
});

export default sessionsSlice.reducer;
