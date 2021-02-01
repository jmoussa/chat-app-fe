import React from "react";
import { Redirect } from "react-router-dom";

import { Box, Stack, Button, defaultTheme } from "luxor-component-library";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
    };
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  onClickHandler(e) {
    console.log("Login Event:");
    console.log(e);
    localStorage.setItem("token", "testToken");
    this.setState({ isLoggedIn: true });
  }

  render() {
    const { isLoggedIn } = this.state;
    if (isLoggedIn) {
      return <Redirect push to="/dashboard" />;
    } else {
      return (
        <Box
          padding="large"
          margin="0"
          height="100vh"
          backgroundColor={defaultTheme.palette.grey[100]}
          textAlign="center"
        >
          <Stack>
            <Box padding="medium">
              <label for="uname">
                <b>Username</b>
              </label>
              <input
                type="text"
                placeholder="Enter Username"
                name="uname"
                required
              />

              <label for="psw">
                <b>Password</b>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                name="psw"
                required
              />
            </Box>
            <Box>
              <Button
                variant="solid"
                color="primary"
                size="small"
                text="Login"
                onClick={this.onClickHandler}
              />
            </Box>
          </Stack>
        </Box>
      );
    }
  }
}

export default Login;
