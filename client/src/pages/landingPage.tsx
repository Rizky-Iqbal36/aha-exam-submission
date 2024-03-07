import React from "react";

import SwipeableViews from "react-swipeable-views";
import { AppBar, Tabs, Tab, Box, useTheme } from "@mui/material";
import Login from "../components/molekul/login";
import Register from "../components/molekul/register";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function LandingPage() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <div className="App">
      <div className="App-header">
        <Box
          sx={{
            width: 700,
            height: 700,
            "@media screen and (max-width: 480px)": { width: 400, height: 400 },
          }}
        >
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
            >
              <Tab label="Login" {...a11yProps(0)} />
              <Tab label="Register" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
            <TabPanel value={value} index={0} dir={theme.direction}>
              <Login />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <Register />
            </TabPanel>
          </SwipeableViews>
        </Box>
      </div>
    </div>
  );
}

export default LandingPage;
