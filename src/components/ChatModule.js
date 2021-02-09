import React from "react";
import {
  Box,
  Button,
  Row,
  Stack,
  Input,
  defaultTheme,
  fontSizes,
} from "luxor-component-library";
import { get_room } from "../api/rooms";
import { get_user_from_token } from "../api/auth";
import axios from "axios";

class ChatModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: {},
      isLoaded: false,
      currentUser: this.props.user,
      message_draft: "",
    };
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(event) {
    console.log("Input change: " + event.target.value);
    this.setState({ message_draft: event.target.value });
  }

  onClickHandler() {
    console.log("Sending: " + this.state.message_draft);
  }

  componentDidMount() {
    if (!this.props.user) {
      let token = localStorage.getItem("token");
      const instance = axios.create({
        timeout: 1000,
        headers: { Authorization: `Bearer ${token}` },
      });
      instance
        .get(get_user_from_token)
        .then((response) => {
          this.setState({
            currentUser: response.data.username,
          });
        })
        .catch((err) => {
          localStorage.removeItem("token");
          console.log("ERROR FETCHING CURRENT USER\n" + err);
        });
    }
    // Fetch room, set messages, users
    const { room_name } = this.props;
    let token = localStorage.getItem("token");
    const instance = axios.create({
      timeout: 1000,
      headers: { Authorization: `Bearer ${token}` },
    });
    instance
      .get(get_room + "/" + room_name)
      .then((response) => {
        console.log(response.data);
        this.setState({ ...response.data, isLoaded: true });
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.log("ERROR FETCHING ROOM\n" + err);
      });
  }

  render() {
    const input_text_style = {
      padding: "10px",
      paddingLeft: "25px",
      paddingRight: "25px",
      width: "600px",
      borderRadius: "3em",
      outline: "none",
      border: `2px solid ${defaultTheme.palette.primary.light}`,
      fontWeight: 400,
      fontSize: fontSizes.medium,
      fontFamily: defaultTheme.typography.primaryFontFamily,
      color: defaultTheme.palette.grey[400],
    };
    const { isLoaded, messages, members } = this.state;
    if (!isLoaded) {
      return (
        <Box
          margin="xlarge"
          padding="large"
          width="600px"
          height="600px"
          roundedCorners
          backgroundColor={defaultTheme.palette.secondary.light}
        >
          <h1>Loading...</h1>
        </Box>
      );
    } else {
      return (
        <Row width="100%">
          <Stack width="800px">
            <Box
              padding="medium"
              roundedCorners
              style={{
                overflow: "scroll",
                height: "600px",
                width: "800px",
              }}
            >
              <Stack>
                {messages.map((message, index) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        float:
                          message.user.username === this.state.currentUser
                            ? "right"
                            : "left",
                        textAlign:
                          message.user.username === this.state.currentUser
                            ? "right"
                            : "left",
                      }}
                    >
                      <Box
                        marginX="large"
                        padding="small"
                        backgroundColor={defaultTheme.palette.primary.light}
                        color={defaultTheme.palette.common.white}
                        roundedCorners
                        marginBottom="small"
                        width="400px"
                        style={{
                          float:
                            message.user.username === this.state.currentUser
                              ? "right"
                              : "left",
                        }}
                        textAlign={
                          message.user.username === this.state.currentUser
                            ? "right"
                            : "left"
                        }
                        key={{ index }}
                      >
                        {message.content}
                      </Box>
                      <Box
                        padding="small"
                        style={{
                          float:
                            message.user.username === this.state.currentUser
                              ? "right"
                              : "left",
                        }}
                        textAlign={
                          message.user.username === this.state.currentUser
                            ? "right"
                            : "left"
                        }
                      >
                        {message.user.username}
                      </Box>
                    </div>
                  );
                })}
              </Stack>
            </Box>
            <Row padding="medium" space="small">
              <Box padding="small">
                <input
                  style={input_text_style}
                  value={this.state.message_draft}
                  onChange={this.onInputChange}
                />
              </Box>
              <Box padding="small">
                <Button
                  variant="outline"
                  color="secondary"
                  size="medium"
                  text="Send"
                  onClick={this.onClickHandler}
                />
              </Box>
            </Row>
          </Stack>
          <Stack space="small">
            <Box>
              <h1>Room Members</h1>
            </Box>
            {members.map((member, index) => {
              return (
                <Box
                  padding="small"
                  margin="small"
                  backgroundColor={defaultTheme.palette.secondary.main}
                  color={defaultTheme.palette.common.black}
                  marginX="xxxlarge"
                  roundedCorners
                  marginBottom="small"
                  textAlign="center"
                  key={{ index }}
                >
                  {member.username}
                </Box>
              );
            })}
          </Stack>
        </Row>
      );
    }
  }
}
export { ChatModule };

/*
<Input
                  color="primary"
                  size="medium"
                  width="600px"
                  roundedCorners="2rem"
                  value={this.state.message_draft}
                  onChange={this.onInputChange}
                  placeholder="Message"
                />
 */
