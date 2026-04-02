import { useState } from "react";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import assets from "../assets";

const navItems = [
  { path: "/", label: "首页" },
  { path: "/rule", label: "规则" },
  { path: "/recharge", label: "充值" },
  { path: "/service", label: "客服" },
];

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("user_username");

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_username");
    navigate("/login");
  };

  const drawer = (
    <Box sx={{ width: 240 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton component={RouterLink} to={item.path}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        {username ? (
          <Button variant="contained" color="error" fullWidth onClick={handleLogout} startIcon={<LogoutIcon />}>
            退出登录
          </Button>
        ) : (
          <Button component={RouterLink} to="/login" variant="contained" fullWidth>
            登录
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, minWidth: 0 }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1, display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Box component={'img'} src={assets.LOGO} alt="Logo" sx={{ height: 60 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexWrap: 'wrap' }}>
              {navItems.map((item) => (
                <Button key={item.path} size="small" component={RouterLink} to={item.path} color="inherit" sx={{fontSize: 18}}>
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          {username ? (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, ml: 2 }}>
              <Typography noWrap>{`欢迎, ${username}`}</Typography>
              <Button variant="outlined" color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                退出
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 2 }}>
              <Button component={RouterLink} to="/register" color="inherit">
                注册
              </Button>
              <Button component={RouterLink} to="/login" variant="outlined" color="inherit">
                登录
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle} sx={{ display: { md: "none" } }}>
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flex: 1, px: { xs: 2, md: 4 } }}>
        <Outlet />
      </Box>
    </Box>
  );
}
