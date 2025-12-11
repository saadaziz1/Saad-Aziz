import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

import DarkLightToggle from "../ui/DarkLightTheme";
import { useState } from "react";
import { NavLinks } from "../../constants";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const navigate = useNavigate();

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const { isAuthenticated, logout } = useAuthStore();


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            Project <span style={{ color: "#00C49A" }}>Manager</span>
          </Typography>
          {!isAuthenticated && (
            <Button
              color="primary"
              variant="contained"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}

          {isAuthenticated && (
            <Box sx={{ display: "flex" }}>
              <DarkLightToggle />
              {!isMobile && (
                <Button color="error" variant="outlined" onClick={handleLogout}>
                  Logout
                </Button>
              )}

              {isMobile && (
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={()=>toggleDrawer(true)}
                >
                  <MenuIcon sx={{ fontSize: 32 }} />
                </IconButton>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={()=>toggleDrawer(false)}>
        <Box
          role="presentation"
          sx={{ width: 200, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2 }}
          onClick={()=>toggleDrawer(false)}
        >
          <List>
            {NavLinks.map((link,index) => (
              <ListItem key={index}>
                <ListItemButton onClick={()=>navigate(link.LINK)} >
                  <ListItemText primary={link.TEXT} />
                </ListItemButton>
              </ListItem>
            ))}
            
          </List>
          <Button color="error" variant="outlined" onClick={handleLogout}>
                  Logout
                </Button>
        </Box>
      </Drawer>
    </>
  );
}
