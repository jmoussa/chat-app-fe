import React from "react";
import {
  Box,
  Stack,
  Row,
  fontSizes,
  defaultTheme,
} from "luxor-component-library";
import { get_user_from_token, upload_profile_pic } from "../api/auth";
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
    this.onEnterHandler = this.onEnterHandler.bind(this);
    this.imageUpload = this.imageUpload.bind(this);
  }

  onUsernameChange(e) {
    this.setState({ new_user: { username: e.target.value } });
  }

  onPasswordChange(e) {
    console.log(e.target.value);
    this.setState({ new_user: { password: e.target.value } });
  }

  onEnterHandler(e) {
    e.preventDefault();
  }
  imageUpload(e) {
    console.log("Image Upload");
    const files = e.target.files;
    const formData = new FormData();
    formData.append("myFile", files[0]);

    let token = localStorage.getItem("token");
    const instance = axios.create({
      timeout: 1000,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    instance
      .post(upload_profile_pic)
      .then((response) => {
        this.setState({ user: response.data, isLoaded: true });
      })
      .catch((err) => {
        console.error("ERROR Uploading Profile Picture");
        console.error(err);
      });
  }
  componentDidMount() {
    let token = localStorage.getItem("token");
    const instance = axios.create({
      timeout: 1000,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
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
    const input_text_style = {
      padding: "10px",
      paddingLeft: "25px",
      paddingRight: "25px",
      width: "400px",
      borderRadius: "3em",
      outline: "none",
      border: `2px solid ${defaultTheme.palette.error.main}`,
      fontWeight: 400,
      fontSize: fontSizes.medium,
      fontFamily: defaultTheme.typography.primaryFontFamily,
      color: defaultTheme.palette.grey[400],
    };
    const { isLoaded, user } = this.state;
    if (!isLoaded) {
      return <Box>Loading...</Box>;
    } else {
      return (
        <Box
          margin="none"
          padding="large"
          height="100vh"
          backgroundColor={defaultTheme.palette.grey[200]}
        >
          <Row>
            <Box padding="medium">
              <Stack space="medium" textAlign="center">
                <Box>
                  <h1>{user.username} Profile</h1>
                </Box>
                <Box>
                  <img src={user.profile_pic_img_src} alt={user.username} />
                </Box>
                <Box>
                  <input
                    type="file"
                    id="fileUpload"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={this.imageUpload}
                  />
                </Box>
              </Stack>
            </Box>
            <Box>
              <Stack space="medium">
                <Box>
                  <input
                    id="messageText"
                    style={input_text_style}
                    value={this.state.new_user.username}
                    placeholder="New Username"
                    onChange={this.onUsernameChange}
                    autoComplete="off"
                  />
                </Box>
                <Box>
                  <input
                    id="messageText"
                    style={input_text_style}
                    value={this.state.new_user.password}
                    onChange={this.onPasswordChange}
                    onKeyUp={(e) => this.onEnterHandler(e)}
                    type="password"
                    placeholder="New Password"
                    autoComplete="off"
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
