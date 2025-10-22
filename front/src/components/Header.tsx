import { User as UserIcon, LogOut, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../store/userSlice';
import type { RootState, AppDispatch } from '@/store';

export function Header() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme(); // pega as cores do tema

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickAvatar = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
  const result = await dispatch(logout());

  if (logout.fulfilled.match(result)) {
    console.log(result.payload?.message || "Logout realizado com sucesso");
    navigate("/login");
  } else {
    // erro
    console.error("Erro ao fazer logout:", result.payload);
  }
};

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar>
        {/* Logo e navegação */}
        <Box display="flex" alignItems="center" gap={4} flexGrow={1}>
          {/* Logo */}
          <Box display="flex" alignItems="center" gap={1}>
            <CheckSquare
              style={{ fontSize: 32, color: theme.palette.primary.main }}
            />
            <Typography
              variant="h6"
              component="h1"
              color="primary"
              fontWeight="bold"
            >
              ContactFlow
            </Typography>
          </Box>

          {/* Navegação */}
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/Home")}
            >
              Home
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/contacts/register")}
            >
              Contact Register
            </Button>
          </Box>
        </Box>

        {/* User Profile */}
        <IconButton onClick={handleClickAvatar}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <UserIcon color="white" />
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          {/* Label com nome e email */}
          <Box px={2} py={1}>
            <Typography variant="body1">{user?.name || "Usuário"}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || "email@exemplo.com"}
            </Typography>
          </Box>

          <Divider />

          {/* Item de logout */}
          <MenuItem onClick={handleLogout}>
            <LogOut style={{ marginRight: 8 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
