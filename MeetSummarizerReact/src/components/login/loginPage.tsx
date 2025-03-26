// import { Button, Grid2 } from "@mui/material";
// import SignIn from "./SignIn";
// import SignUp from "./SignUp";
// import { useContext, useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../UserRedux/reduxStore";
// import UserDetails from "./UserDetails";
// import { IsloginContext } from "../Layout";

// const LoginPage = () => {
//     const [showLogin, setShowLogin] = useState(false);
//     const [showRegister, setShowRegister] = useState(false);
//     const user = useSelector((state: RootState) => state.Auth.user);
//     const [isLogin] = useContext(IsloginContext);

//     const handleLoginClick = () => {
//         setShowLogin(true);
//         setShowRegister(false);
//     };

//     const handleRegisterClick = () => {
//         setShowRegister(true);
//         setShowLogin(false);
//     };

//     return (
//         <Grid2 container spacing={2}>
//             <Grid2 size={2}>
//                 <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                     {user?.token ? (
//                         <UserDetails />
//                     ) : (
//                         <>
//                             <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//                                 <Button color="primary" variant="contained" onClick={handleLoginClick}>
//                                     Sign in
//                                 </Button>
//                                 <Button color="primary" variant="contained" onClick={handleRegisterClick}>
//                                     Sign up
//                                 </Button>
//                             </div>
//                             {showLogin && <SignIn />}
//                             {showRegister && <SignUp />}
//                         </>
//                     )}
//                 </div>
//             </Grid2>
//         </Grid2>
//     );
// };

// export default LoginPage;

//עיצוב
import { Box, Button, Grid } from "@mui/material";
import SignIn from "./SignIn";
// import SignUp from "./SignUp";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import UserDetails from "./UserDetails";

const LoginPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const user = useSelector((state: RootState) => state.Auth.user);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  return (
    <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={12} md={6}>
        {user?.token ? (
          <UserDetails />
        ) : (
          <>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2 }}>
              <Button variant="contained" color="primary" onClick={handleLoginClick}>
                Sign In
              </Button>
              <Button variant="contained" color="secondary" onClick={handleRegisterClick}>
                Sign Up
              </Button>
            </Box>
            {showLogin && <SignIn />}
            {/* {showRegister && <SignUp />} */}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default LoginPage;
