import { useContext, useState } from "react";
// @mui
import { alpha } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Avatar,
  IconButton,
  Popover,
} from "@mui/material";
// mocks_
import account from "../../../_mock/account";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Loading from "../../../components/loading/Loading";
import { auth } from "../../../firebase/firebaseConfig";
import avt from "/assets/images/avatars/avatar_default.jpg";
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const { currentUser, userData, loading } = useContext(AuthContext);
  const nav = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    nav("/login");
  };

  return (
    <>
      {loading ? (
        <div>...</div>
      ) : (
        <>
          <IconButton
            onClick={handleOpen}
            sx={{
              p: 0,
              ...(open && {
                "&:before": {
                  zIndex: 1,
                  content: "''",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  position: "absolute",
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                },
              }),
            }}
          >
            <Avatar src={currentUser.photoURL ?? avt} alt="photoURL" />
          </IconButton>

          <Popover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                p: 0,
                mt: 1.5,
                ml: 0.75,
                width: 180,
                "& .MuiMenuItem-root": {
                  typography: "body2",
                  borderRadius: 0.75,
                },
              },
            }}
          >
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" noWrap>
                {currentUser.displayName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {currentUser.email}
              </Typography>
            </Box>

            <Divider sx={{ borderStyle: "dashed" }} />

            <MenuItem onClick={logout} sx={{ m: 1 }}>
              Logout
            </MenuItem>
          </Popover>
        </>
      )}
    </>
  );
}
