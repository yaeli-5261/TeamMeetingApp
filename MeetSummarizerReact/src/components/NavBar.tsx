import { AppBar, styled, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom"; // תיקון: שינוי ל-"react-router-dom"

const NavLinkStyled = styled(NavLink)(({ theme }) => ({
    margin: theme.spacing(1),
    textDecoration: 'none',
    color: 'white',
    padding: theme.spacing(1, 2),
    borderRadius: '5px',
    '&:hover': {
        backgroundColor: theme.palette.secondary.main,
    },
}));

const NavBar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <NavLinkStyled to='/'></NavLinkStyled>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
