import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Shell() {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      
        <Navbar />
    
      
      <Box sx={{ maxWidth: "1500px", margin: "0 auto" }}>
      <Box sx={{ display: "flex" }}>
        
        <Sidebar />

        {/* MAIN CONTENT */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            
             // offset for the sidebar on desktop
          }}
        >
          <Outlet />
        </Box>
      </Box>
      </Box>
    </Box>
  );
}
