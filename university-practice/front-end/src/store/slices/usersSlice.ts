import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Your initialized Firebase
import { setAuthToken } from '../../api/axiosInstance';
import { User } from '../../types/user'; // Updated import for the new User interface

type UserState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk<
  User, // return type
  { email: string; password: string }, // args type
  { rejectValue: string }
>('user/loginUser', async ({ email, password }, thunkAPI) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    setAuthToken(idToken);
    const user: User = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
    };
    return user;
  } catch (error: unknown) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

// Async thunk for logout
export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await signOut(auth);
  setAuthToken(null);
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
