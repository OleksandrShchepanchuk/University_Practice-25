// src/store/slices/sessionsSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { MoviesSession } from "../../types/movies-session";
import {
    getSessions,
    //createSession,
    //updateSession,
    //deleteSession,
} from "../../api/sessions";

interface SessionsState {
    sessions: MoviesSession[];
    loading: boolean;
    error: string | null;
}

const initialState: SessionsState = {
    sessions: [],
    loading: false,
    error: null,
};

export const fetchSessions = createAsyncThunk<
    MoviesSession[],
    void,
    { rejectValue: string }
>("sessions/fetchAll", async (_, thunkAPI) => {
    try {
        return await getSessions();
    } catch (err) {
        return thunkAPI.rejectWithValue(
            (err as Error).message || "Failed to load sessions"
        );
    }
});

const sessionsSlice = createSlice({
    name: "sessions",
    initialState,
    reducers: {},
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
                state.error = action.payload ?? "Unknown error";
            });
    },
});

export default sessionsSlice.reducer;
