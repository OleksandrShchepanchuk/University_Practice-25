import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFavourites, addFavourite, removeFavourite } from '../../api/favourites';
import type { Movie } from '../../types/movie';
import type { RootState } from '../../store';

interface FavouriteState {
    list: Movie[];
    loading: boolean;
    error: string | null;
    hasLoaded: boolean;
}

const initialState: FavouriteState = {
    list: [],
    loading: false,
    error: null,
    hasLoaded: false,
};

export const loadFavourites = createAsyncThunk('favourites/load', async (_, { rejectWithValue }) => {
    try {
        const data = await getFavourites();
        return data.map((f) => f.movie);
    } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to load favourites');
    }
});

export const toggleFavourite = createAsyncThunk<
    { movieId: string; action: 'add' | 'remove'; movie?: Movie },
    Movie,
    { state: RootState }
>('favourites/toggle', async (movie, { getState, rejectWithValue }) => {
    const { list } = getState().favourites;
    const exists = list.some((f) => f.id === movie.id);

    try {
        if (exists) {
            await removeFavourite({ movie });
            return { movieId: movie.id, action: 'remove' };
        } else {
            await addFavourite({ movie });
            return { movieId: movie.id, action: 'add', movie };
        }
    } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to toggle favourite');
    }
});

const favouriteSlice = createSlice({
    name: 'favourites',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadFavourites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadFavourites.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
                state.hasLoaded = true;
            })
            .addCase(loadFavourites.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'Failed to load favourites';
            })
            .addCase(toggleFavourite.fulfilled, (state, action) => {
                const { movieId, action: favAction, movie } = action.payload;

                if (favAction === 'add' && movie) {
                    // Avoid duplicates
                    const exists = state.list.some((m) => m.id === movie.id);
                    if (!exists) state.list.push(movie);
                }

                if (favAction === 'remove') {
                    state.list = state.list.filter((f) => f.id !== movieId);
                }
            })
            .addCase(toggleFavourite.rejected, (state, action) => {
                state.error = (action.payload as string) || 'Failed to toggle favourite';
            });
    },
});

export default favouriteSlice.reducer;