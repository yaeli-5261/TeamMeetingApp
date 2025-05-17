"use client"

import type React from "react"
import { useState } from "react"
import { Button, TextField, Box, Typography, Paper, Avatar, Container, CircularProgress } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { AppDispatch, RootState } from "../../store/store"
import { signIn } from "../../store/authSlice"
import { Login as LoginIcon } from "@mui/icons-material"
import { motion } from "framer-motion"
import { getCookie } from "../../services/meetingService"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state: RootState) => state.Auth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // שליחה של הנתונים ל-Redux
      const result = await dispatch(signIn({ email, password })).unwrap()

      // בדיקה אם ההתחברות הצליחה
      if (result && result.token) {
        // שמירת הטוקן ב-cookie
        document.cookie = `auth_token=${result.token}; path=/; secure; samesite=strict;`
        console.log("Token from server:", getCookie("auth_token"))

        // ניווט לדף הפגישות
        navigate("/meetings")
      }
    } catch (err) {
      console.error("Login failed", err)
    }
  }

  return (
  
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper
          elevation={0}
          sx={{
            p: 0,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 3,
              bgcolor: "#10a37f",
              color: "white",
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: "white",
                color: "#10a37f",
                mx: "auto",
                mb: 2,
              }}
            >
              <LoginIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              התחברות למערכת 
            </Typography>
            <Typography variant="body2">הזן את פרטי ההתחברות שלך כדי להיכנס למערכת</Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <TextField
                label="דואר אלקטרוני"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                variant="outlined"
                autoComplete="email"
              />

              <TextField
                label="סיסמה"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                variant="outlined"
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  bgcolor: "#10a37f",
                  "&:hover": {
                    bgcolor: "#0e8a6c",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "התחבר"}
              </Button>

              {error && (
                <Typography color="error" textAlign="center">
                  {error}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  )
}

export default SignIn

