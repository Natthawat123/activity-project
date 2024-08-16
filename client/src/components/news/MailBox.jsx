import * as React from "react";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import DraftsIcon from "@mui/icons-material/Drafts";
import "../../App.css";

export default function MailBox({ onClick, news = [] }) {
  const [count, setCount] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    setCount(news.length);
  }, [news]);

  return (
    <Box
      sx={{
        color: "action.active",
        display: "flex",
        flexDirection: "column",
        "& > *": {
          marginBottom: 2,
        },
      }}
    >
      <div
        onClick={onClick}
        style={{ cursor: "pointer" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Badge className="rgb" badgeContent={count}>
          {isHovered ? <DraftsIcon /> : <MailIcon />}{" "}
        </Badge>
      </div>
    </Box>
  );
}
