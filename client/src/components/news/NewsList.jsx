import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArticleIcon from "@mui/icons-material/Article";
import Box from "@mui/material/Box";
import axios from "axios";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Tooltip from "@mui/material/Tooltip";

export default function NewsList({ news = [], id }) {
  const [open, setOpen] = React.useState({});
  const [selectedNews, setSelectedNews] = React.useState(null);
  const [readStatus, setReadStatus] = React.useState({}); // State to track read status

  const handleClick = (news_ID) => () => {
    setOpen((prev) => ({
      ...prev,
      [news_ID]: !prev[news_ID],
    }));
  };

  const handleListItemClick = (item) => {
    setSelectedNews(item);
  };

  const read = async (news_ID) => {
    // Uncomment and adjust the API call as needed
    // try {
    //   const res = await axios.put(`/api/notify`, {
    //     user_ID: id,
    //     news_ID: news_ID,
    //   });
    //   if (res.status === 200) {
    //     setReadStatus((prev) => ({ ...prev, [news_ID]: 'read' })); // Update read status
    //   } else {
    //     console.error("Failed to mark news as read");
    //   }
    // } catch (e) {
    //   console.error("Error marking news as read:", e);
    // }
    setReadStatus((prev) => ({ ...prev, [news_ID]: "read" })); // Update read status locally
  };

  const color = (news_ID) => {
    return readStatus[news_ID] === "read" ? "#fdd835" : "#e0e0e0"; // Check read status
  };

  const tootip = (status) => {
    return status === "read" ? "อ่านแล้ว" : "ทำเครื่องหมายว่าอ่านแล้ว";
  };

  return (
    <div>
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
          <React.Fragment key={item.news_ID}>
            <ListItemButton onClick={handleClick(item.news_ID)}>
              <ListItemIcon>
                <Tooltip title={tootip(readStatus[item.news_ID])}>
                  <CheckCircleOutlineIcon
                    sx={{
                      color: color(item.news_ID), // Use the updated color function
                      "&:hover": {
                        color: "#fdd835",
                      },
                    }}
                    onClick={() => read(item.news_ID)}
                  />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary={item.news_topic} />
              {open[item.news_ID] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open[item.news_ID]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => handleListItemClick(item)}
                >
                  <ListItemText
                    primary={item.news_topic}
                    secondary={item.news_desc}
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
    </div>
  );
}
