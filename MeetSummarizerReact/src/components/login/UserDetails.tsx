// import { Avatar, Typography } from "@mui/material";
// import { deepOrange } from "@mui/material/colors";
// import { useSelector } from "react-redux";
// import { RootState } from "../UserRedux/reduxStore";

// const Userdetails = () => {
//     const user = useSelector((state: RootState) => state.Auth.user);

//     return (
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <Avatar sx={{ bgcolor: deepOrange[500], marginRight: "8px" }}>
//                 {user?.userName?.charAt(0) || "U"}
//             </Avatar>
//             <Typography variant="body1">{user?.userName || "Unknown User"}</Typography>
//         </div>
//     );
// };

// export default Userdetails;

//עיצוב

import { Avatar, Typography, Box } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const UserDetails = () => {
  const user = useSelector((state: RootState) => state.Auth.user);

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
      <Avatar sx={{ bgcolor: deepOrange[500], width: 48, height: 48 }}>
        {user?.userName?.charAt(0).toUpperCase() || "U"}
      </Avatar>
      <Typography variant="h6">{user?.userName || "Unknown User"}</Typography>
    </Box>
  );
};

export default UserDetails;
