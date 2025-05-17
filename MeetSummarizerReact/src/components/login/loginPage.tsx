// import { Box, Button, Grid } from "@mui/material";
// import SignIn from "./SignIn";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../../store/store";
// import UserDetails from "./UserDetails";

// const LoginPage = () => {
//   const [showLogin, setShowLogin] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);
//   const user = useSelector((state: RootState) => state.Auth.user);

//   const handleLoginClick = () => {
//     setShowLogin(true);
//     setShowRegister(false);
//   };

//   const handleRegisterClick = () => {
//     setShowRegister(true);
//     setShowLogin(false);
//   };

//   return (
//     <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
//       <Grid item xs={12} md={6}>
//         {user?.token ? (
//           <UserDetails />
//         ) : (
//           <>
//             <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2 }}>
//               <Button variant="contained" color="primary" onClick={handleLoginClick}>
//                 Sign In
//               </Button>
//               <Button variant="contained" color="secondary" onClick={handleRegisterClick}>
//                 Sign Up
//               </Button>
//             </Box>
//             {showLogin && <SignIn />}
//             {/* {showRegister && <SignUp />} */}
//           </>
//         )}
//       </Grid>
//     </Grid>
//   );
// };

// export default LoginPage;
