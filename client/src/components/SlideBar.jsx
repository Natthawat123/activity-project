import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Divider from "@mui/material/Divider";
import NewsList from "./NewsList.jsx";
import MailBox from "./MailBox.jsx";

export default function SlideBar() {
  const [state, setState] = React.useState({ right: false });
  const drawerRef = React.useRef(null);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    if (open) {
      setState({ right: open });
    } else {
      setState({ right: open });
    }
  };

  // Function to handle click events inside the drawer
  const handleDrawerClick = (event) => {
    event.stopPropagation(); // Prevents clicks inside the drawer from closing it
  };

  const list = () => (
    <Box sx={{ width: 500 }} role="presentation" onClick={handleDrawerClick}>
      แจ้งเตือน
      <NewsList />
      <Divider />
    </Box>
  );

  return (
    <div>
      <MailBox onClick={toggleDrawer(true)} />
      <SwipeableDrawer
        anchor="right"
        open={state.right}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        onClick={(event) => {
          if (drawerRef.current && drawerRef.current.contains(event.target)) {
            // Clicks inside the drawer should not close it
            event.stopPropagation();
          }
        }}
      >
        <div ref={drawerRef}>{list()}</div>
      </SwipeableDrawer>
    </div>
  );
}
