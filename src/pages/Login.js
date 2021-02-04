import React from "react";
import { Redirect } from "react-router-dom";
import { login, register } from "../api/auth";
import { Box, Stack, Row, Button, defaultTheme } from "luxor-component-library";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      username: "",
      password: "",
    };
    this.loginHandler = this.loginHandler.bind(this);
    this.registerHandler = this.registerHandler.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.usernameChange = this.usernameChange.bind(this);
  }

  usernameChange(e) {
    this.setState({
      username: e.target.value,
    });
  }

  passwordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  loginHandler(e) {
    //API Call then set token to response
    e.preventDefault();
    fetch(login, {
      method: "PUT",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response);
        this.setState({ isLoggedIn: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  registerHandler(e) {
    //API Call then set token to response
    e.preventDefault();
    fetch(register, {
      method: "PUT",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response);
        this.setState({ isLoggedIn: true });
      })
      .catch((err) => {
        console.log(err);
      });
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
                onchange={this.usernameChange}
                type="text"
                placeholder="Enter Username"
                name="uname"
                required
              />

              <label for="psw">
                <b>Password</b>
              </label>
              <input
                onchange={this.passwordChange}
                type="password"
                placeholder="Enter Password"
                name="psw"
                required
              />
            </Box>
            <Row>
              <Box>
                <Button
                  variant="solid"
                  color="primary"
                  size="medium"
                  text="Login"
                  onClick={this.loginHandler}
                />
              </Box>
              <Box>
                <Button
                  variant="outline"
                  color="primary"
                  size="medium"
                  text="Register"
                  onClick={this.registerHandler}
                />
              </Box>
            </Row>
          </Stack>
        </Box>
      );
    }
  }
}

export default Login;
