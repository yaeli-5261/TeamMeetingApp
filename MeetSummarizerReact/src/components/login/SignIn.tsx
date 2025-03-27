import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store/store";
import { signIn } from "../../store/authSlice";

export const getCookie=(name: string) =>{

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || '';
  }
  return '';
}

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.Auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // שליחה של הנתונים ל-Redux
      const result = await dispatch(signIn({ email, password }));
      const token = result.payload.token;
      document.cookie = `auth_token=${token}; path=/; secure; samesite=strict;`;
      console.log("Token from server:", getCookie('auth_token'));
      
      // תהליך שמוודא שהתוצאה היא הצלחה
      if (signIn.fulfilled.match(result)) {
        const userData = result.payload; // { token, user: { teamId, userName, ... } }
        console.log("User data from server:", userData);

        // בדיקה אם ה-userData מכיל את ה-teamId
        if (userData && userData.user && userData.user.teamId != null) {
          localStorage.setItem("user", JSON.stringify(userData.user));
          console.log("User data saved to localStorage:", userData.user);
          navigate("/meetings");
        } else {
          console.error("❌ No teamId found in user data.", userData);
        }
      } else {
        console.error("❌ Login failed: Invalid response format.");
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      <TextField label="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Box>
  );
};

export default SignIn;
