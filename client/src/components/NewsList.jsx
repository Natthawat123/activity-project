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
import StarBorder from "@mui/icons-material/StarBorder";
import axios from "axios";

export default function NewsList() {
  const [open, setOpen] = React.useState(true);
  const [news, setNews] = React.useState([]);
  const [selectedNews, setSelectedNews] = React.useState(null);

  const handleClick2 = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    axios.get("/api/news").then((res) => setNews(res.data));
  }, []);

  const handleListItemClick = (item) => {
    setSelectedNews(item);
  };

  return (
    <div>
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            รายการแจ้งเตือน
          </ListSubheader>
        }
      >
        {news.map((item) => (
          <React.Fragment key={item.news_ID}>
            <ListItemButton onClick={handleClick2}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={item.news_topic} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => handleListItemClick(item)}
                >
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.news_topic}
                    secondary={item.news_desc}
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}
