import React from "react";
import { Box, Stack, Row, Input, defaultTheme } from "luxor-component-library";
import { get_user_from_token } from "../api/auth";
import axios from "axios";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      new_user: {},
      isLoaded: false,
    };
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  onUsernameChange(e) {
    this.setState({ new_user: { username: e.target.value } });
  }

  onPasswordChange(e) {
    console.log(e.target.value);
    this.setState({ new_user: { password: e.target.value } });
  }

  componentDidMount() {
    let token = localStorage.getItem("token");
    const instance = axios.create({
      timeout: 1000,
      headers: { Authorization: `Bearer ${token}` },
    });
    instance
      .get(get_user_from_token)
      .then((response) => {
        this.setState({ user: response.data, isLoaded: true });
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.log("ERROR FETCHING CURRENT USER\n" + err);
      });
  }

  render() {
    const { isLoaded, user } = this.state;
    if (!isLoaded) {
      return <Box>Loading...</Box>;
    } else {
      return (
        <Box
          margin="none"
          padding="large"
          paddingBottom="none"
          height="100vh"
          backgroundColor={defaultTheme.palette.secondary.light}
        >
          <Row>
            <Box textAlign="center">
              <h1>{user.username} Profile</h1>
            </Box>
            <Box>
              <Stack>
                <Box>
                  <Input
                    color="primary"
                    size="medium"
                    width="600px"
                    roundedCorners="2rem"
                    value={this.state.new_user.username}
                    onChange={this.onUsernameChange}
                    placeholder="New Username"
                  />
                </Box>
                <Box>
                  <Input
                    color="primary"
                    size="medium"
                    width="600px"
                    roundedCorners="2rem"
                    value={this.state.new_user.password}
                    onKeyUp={(e) => this.onEnterHandler(e)}
                    onChange={this.onPasswordChange}
                    type="password"
                    placeholder="New Password"
                  />
                </Box>
              </Stack>
            </Box>
          </Row>
        </Box>
      );
    }
  }
}

export default Profile;
