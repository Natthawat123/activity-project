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

export default function NewsList({ news = [] }) {
  const [open, setOpen] = React.useState({});
  const [selectedNews, setSelectedNews] = React.useState(null);

  const handleClick = (news_ID) => () => {
    setOpen((prev) => ({
      ...prev,
      [news_ID]: !prev[news_ID],
    }));
  };

  const handleListItemClick = (item) => {
    setSelectedNews(item);
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
                <StarIcon sx={{ color: "#fdd835" }} />
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
