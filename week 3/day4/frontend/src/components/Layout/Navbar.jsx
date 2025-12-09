import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { styled, alpha } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: "100%",
  maxWidth: 400,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  padding: theme.spacing(1, 2),
}));

export default function Navbar({ onHamburgerClick }) {
  return (
    <AppBar position="static" sx={{ width: "100%" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
        {/* Left: Title */}
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Project<span style={{ color: "#00C49A" }}>Hub</span>
        </Typography>

        {/* Right: Search + Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Search>
            <StyledInputBase placeholder="Search…" inputProps={{ "aria-label": "search" }} />
          </Search>

          <IconButton size="large" color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon sx={{ fontSize: 32 }} />
            </Badge>
          </IconButton>

          <IconButton size="large" color="inherit" onClick={onHamburgerClick}>
            <MenuIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
