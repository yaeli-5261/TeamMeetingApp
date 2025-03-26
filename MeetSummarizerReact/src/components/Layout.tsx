// import { Outlet } from "react-router-dom";
// import NavBar from "./NavBar";
// import { createContext, useState } from "react";
// import LoginPage from "./login/loginPage";

// export const IsloginContext = createContext<any>(undefined);

// const Layout = () => {
//     const [islogin, setIslogin] = useState(false);

//     return (
//         <IsloginContext.Provider value={[islogin, setIslogin]}>
//             <NavBar />
//             <div style={{
//                 display: "flex", position: "absolute", alignItems: "center",
//                 top: "5%", left: "5%"
//             }}>
//                 <LoginPage />
//             </div>
//             <Outlet />
//         </IsloginContext.Provider>
//     );
// };

// export default Layout;
///design 
import React from "react";
import { AppBar, Toolbar, Typography, Button, Avatar, Box, Container } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Slide from "@mui/material/Slide";
import { RootState } from "../store/store";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.Auth.user);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleMeetings = () => {
    navigate("/meetings");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: 'url("")', // ניתן לשנות את כתובת הרקע
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* תפריט עליון עם אנימציה */}
      <Slide direction="down" in={true} mountOnEnter unmountOnExit>
        <AppBar position="static" sx={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
              Meeting Manager
            </Typography>
            <Button color="inherit" onClick={handleSignIn} sx={{ marginRight: 2 }}>
              Sign In
            </Button>
            <Button color="inherit" onClick={handleMeetings} sx={{ marginRight: 2 }}>
              My Meetings
            </Button>
            {user?.userName && (
              <Avatar sx={{ bgcolor: deepOrange[500], transition: "transform 0.3s", "&:hover": { transform: "scale(1.2)" } }}>
                {user.userName.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </Toolbar>
        </AppBar>
      </Slide>

      {/* גוף העמוד */}
      <Container sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
