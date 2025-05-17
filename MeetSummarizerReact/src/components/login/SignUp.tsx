// import React, { useState } from "react";
// import { Button, TextField, Box } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { signUp } from "../UserRedux/authSlice";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../UserRedux/reduxStore";

// const API_URL = "https://localhost:7214/api/Auth/register"; // עדכן את ה-API שלך

// const SignUp = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [name, setName] = useState("");
//     const [error, setError] = useState("");
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post(`${API_URL}`, { userName: name, email: email, password: password, role: "Admin" });
//             if (response.data.token) {
//                 dispatch(signUp({ userName: name, email: email, password: password, role: "Admin" }));
//                 console.log(response.data);
                
//                 navigate("/FileUploader");
//             }
//         } catch (error: any) {
//             setError(error.response?.data?.message || "Signup failed");
//         }
//     };

//     return (
//         <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//             <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
//             <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
//             <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
//             <Button type="submit" variant="contained" color="primary">
//                 Sign Up
//             </Button>
//             {error && <p style={{ color: "red" }}>{error}</p>}
            
//         </Box>
//     );
// };

// export default SignUp;

