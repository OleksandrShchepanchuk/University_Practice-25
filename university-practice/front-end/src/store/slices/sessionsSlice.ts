// src/store/slices/sessionsSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MoviesSession } from '../../types/movies-session';
import {
    getSessions,
    //createSession,
    //updateSession,
    //deleteSession,
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
            });
    },
});

export default sessionsSlice.reducer;
