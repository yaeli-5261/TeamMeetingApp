import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store/store";
import { signIn } from "../../store/authSlice";

const SignIn = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.Auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // שליחה של הנתונים ל-Redux
      const result = await dispatch(signIn({ userName: name, password }));

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
      <TextField label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Box>
  );
};

export default SignIn;
