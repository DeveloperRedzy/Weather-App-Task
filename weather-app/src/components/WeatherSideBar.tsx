import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Dashboard,
  LocationCity,
} from "@mui/icons-material";
import { DRAWER_WIDTH } from "../constants/layout";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

interface WeatherSideBarProps {
  open: boolean;
  handleDrawerClose: () => void;
}

export const WeatherSideBar: FC<WeatherSideBarProps> = ({
  handleDrawerClose,
  open,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const drawerContent = (
    <>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose} tabIndex={open ? 0 : -1}>
          {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/dashboard")}
            tabIndex={open ? 0 : -1}
          >
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary={t("navigation.dashboard")} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/location")}
            tabIndex={open ? 0 : -1}
          >
            <ListItemIcon>
              <LocationCity />
            </ListItemIcon>
            <ListItemText primary={t("navigation.location")} />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
      ModalProps={{
        keepMounted: true,
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
