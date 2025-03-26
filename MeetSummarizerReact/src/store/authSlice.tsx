import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../models/user";



const API_URL = "https://localhost:7214/api/Auth";

// פעולה להתחברות
export const signIn = createAsyncThunk(
    "Auth/login",
    async (user: { userName: string; password: string }, thunkAPI) => {
        try {
            const res = await axios.post(`${API_URL}/login`, {
                userName: user.userName,
                password: user.password
            });
            return res.data; 
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data || "Failed to sign in");
        }
    }
);

// פעולה לרישום משתמש חדש
export const signUp = createAsyncThunk(
    "Auth/register",
    async (user: { userName: string; email: string; password: string; role: string }, thunkAPI) => {
        try {
            const res = await axios.post(`${API_URL}/register`, {
                userName: user.userName,
                Email: user.email,
                Password: user.password,
                role: user.role
            });
            return res.data; // מניח שהשרת מחזיר { token, user }
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data || "Failed to sign up");
        }
    }
);

// טעינת משתמש מה-Session Storage אם קיים
const loadUserFromSession = (): User | null => {
    const userData = sessionStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
};

// יצירת Slice לניהול המצב של המשתמש
const authSlice = createSlice({
    name: "Auth",
    initialState: {
        user: {} as User,
        loading: false,
        error: ""
    },
    reducers: {
        logout: (state) => {
            state.user = {} as User;
            sessionStorage.removeItem("user");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signIn.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(signIn.fulfilled, (state, action: PayloadAction<{ token: string; user:User}>) => {
                state.loading = false;
                state.user = action.payload.user;
                console.log(state.user);
                state.user.token = action.payload.token;
                sessionStorage.setItem("user", JSON.stringify(state.user));
            })
            .addCase(signIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(signUp.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(signUp.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.user.token = action.payload.token;
                sessionStorage.setItem("user", JSON.stringify(state.user));
            })
            .addCase(signUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice;
