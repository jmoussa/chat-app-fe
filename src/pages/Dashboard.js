import React from "react";
import { Box, Stack, Row, defaultTheme } from "luxor-component-library";

class Dashboard extends React.Component {
  componentDidMount() {
    console.log("Start Fetching Conversations");
  }

  render() {
    return (
      <Box
        margin="none"
        padding="large"
        height="100vh"
        backgroundColor={defaultTheme.palette.grey[100]}
      >
        <Row>
          <Stack>
            <Box textAlign="center">
              <h1>Dashboard</h1>
            </Box>
          </Stack>
        </Row>
      </Box>
    );
  }
}

export default Dashboard;
