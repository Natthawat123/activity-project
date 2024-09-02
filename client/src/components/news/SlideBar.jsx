import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import MailIcon from "@mui/icons-material/Mail";
import DraftsIcon from "@mui/icons-material/Drafts";
import ArticleIcon from "@mui/icons-material/Article";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Badge from "@mui/material/Badge";
import axios from "axios";
import "../../App.css";

export default function SlideBar() {
  const [state, setState] = React.useState({ right: false });
  const [news, setNews] = React.useState([]);
  const [open, setOpen] = React.useState({});
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const drawerRef = React.useRef(null);
  const login_ID = localStorage.getItem("login_ID");

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `/api/notification?login_ID=${login_ID}`
        );
        setNews(response.data);
        console.log(response);
        setUnreadCount(
          response.data.filter(
            (notification) => notification.noti_status === "ยังไม่ได้อ่าน"
          ).length
        );
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, [login_ID]);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ right: open });
  };

  const handleDrawerClick = (event) => {
    event.stopPropagation();
  };

  const read = async (news_ID) => {
    try {
      const res = await axios.put(`/api/notify`, {
        login_ID: login_ID,
        news_ID: news_ID,
      });
      if (res.status === 200) {
        const updatedNews = news.map((item) =>
          item.news_ID === news_ID ? { ...item, notify_status: "read" } : item
        );
        setNews(updatedNews);
        setUnreadCount((prevCount) => prevCount - 1);
      }
    } catch (e) {
      console.error("Error marking news as read:", e);
    }
  };

  const color = (noti_status) => {
    return noti_status === "read" ? "#fdd835" : "#e0e0e0";
  };

  const tooltip = (noti_status) => {
    return noti_status === "read" ? "อ่านแล้ว" : "ทำเครื่องหมายว่าอ่านแล้ว";
  };

  const list = () => (
    <Box sx={{ width: 350 }} role="presentation" onClick={handleDrawerClick}>
      <Button className="right-0" onClick={toggleDrawer(false)}>
        Close
      </Button>
      <List
        sx={{ width: "100%", maxWidth: "100%", bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ListSubheader component="div" id="nested-list-subheader">
              รายการแจ้งเตือน
            </ListSubheader>
            <ListSubheader component="div" id="nested-list-subheader">
              รายละเอียดทั้งหมด
            </ListSubheader>
          </Box>
        }
      >
        {news.map((item) => (
          <React.Fragment key={item.noti_ID}>
            <ListItemButton
              onClick={() =>
                setOpen((prev) => ({
                  ...prev,
                  [item.noti_ID]: !prev[item.noti_ID],
                }))
              }
            >
              <ListItemIcon>
                <Tooltip title={tooltip(item.noti_status)}>
                  <CheckCircleOutlineIcon
                    sx={{
                      color: color(item.noti_status),
                      "&:hover": {
                        color: "#fdd835",
                      },
                    }}
                    onClick={() => read(item.noti_ID)}
                  />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary={item.topic} />
              {open[item.noti_ID] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open[item.noti_ID]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText
                    primary={item.topic}
                    secondary={item.description}
                  />
                  <ListItemIcon>
                    <ArticleIcon color="primary" />
                  </ListItemIcon>
                </ListItemButton>
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Box
        sx={{
          color: "action.active",
          display: "flex",
          flexDirection: "column",
          "& > *": {
            marginBottom: 0.5,
          },
        }}
      >
        <div
          onClick={toggleDrawer(true)}
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Badge
            className={
              unreadCount > 0
                ? "rgb"
                : "text-[#94a3b8] gap-3 flex gap-3 items-center px-4 py-2 text-sm  data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            }
            badgeContent={unreadCount}
          >
            {isHovered ? <DraftsIcon /> : <MailIcon />}{" "}
            <p className="text-gray-700 ">การแจ้งเตือน</p>
          </Badge>
        </div>
      </Box>
      <SwipeableDrawer
        anchor="right"
        open={state.right}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <div ref={drawerRef}>{list()}</div>
      </SwipeableDrawer>
    </div>
  );
}
