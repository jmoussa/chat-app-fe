import React from "react";

import { Box, Stack, defaultTheme } from "luxor-component-library";

class Home extends React.Component {
  render() {
    return (
      <Box
        padding="large"
        margin="0"
        height="100vh"
        backgroundColor={defaultTheme.palette.grey[100]}
        textAlign="center"
      >
        <Stack>
          <Box padding="medium">Welcome Home</Box>
          <Box
            backgroundColor={defaultTheme.palette.common.black}
            color={defaultTheme.palette.common.white}
            margin="0px"
            padding="large"
            height="800px"
          >
            Here we will have a home feed
          </Box>
        </Stack>
      </Box>
    );
  }
}

export default Home;
