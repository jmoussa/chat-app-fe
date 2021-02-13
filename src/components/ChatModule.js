import React from "react";
import { animateScroll } from "react-scroll";

import {
  Box,
  Button,
  Row,
  Stack,
  //Input,
  defaultTheme,
  fontSizes,
} from "luxor-component-library";
import { get_room, put_user_into_room } from "../api/rooms";
import { get_user_from_token } from "../api/auth";
import axios from "axios";

var room_name = window.location.pathname.split("/")[
  window.location.pathname.split("/").length - 1
];

var client = null;

function checkWebSocket(username, roomname) {
  if (client === null || client.readyState === WebSocket.CLOSED) {
    client = new WebSocket(
      "ws://localhost:8000/ws/" + roomname + "/" + username
    );
  }
}

class ChatModule extends React.Component {
  constructor(props) {
    super(props);
    this.messagesEndRef = React.createRef();
    this.state = {
      room: {},
      isLoaded: false,
      currentUser: this.props.user,
      message_draft: "",
      messages: [],
    };
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onEnterHandler = this.onEnterHandler.bind(this);
  }
  onInputChange(event) {
    this.setState({ message_draft: event.target.value });
  }
  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "message-list",
      duration: "1ms",
    });
  }
  componentWillUnmount() {
    //Disconnect websocket (Should update room members in db)
    if (client !== null) {
      client.close();
    }
  }
  componentDidMount() {
    room_name = window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ];

    let token = localStorage.getItem("token");
    const instance = axios.create({
      timeout: 1000,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
    // Fetch user info and instantiates websocket
    instance
      .get(get_user_from_token)
      .then((res) => {
        instance
          .put(put_user_into_room + "/" + room_name)
          .then(() => {
            // Fetch room, set messages, users
            instance
              .get(get_room + "/" + room_name)
              .then((response) => {
                //console.log("Room info: \n" + response.data);
                this.setState({ room: { ...response.data }, isLoaded: true });
                if (client == null) {
                  client = new WebSocket(
                    "ws://localhost:8000/ws/" +
                      room_name +
                      "/" +
                      res.data.username
                  );
                }
                this.setState({
                  currentUser: res.data.username,
                  user: res.data,
                });
                client.onopen = () => {
                  console.log("WebSocket Client Connected");
                };
                client.onclose = () => {
                  console.log("Websocket Disconnected");
                };
                client.onmessage = (event) => {
                  let message = JSON.parse(event.data);
                  if (
                    message.hasOwnProperty("type") &&
                    (message.type === "dismissal" ||
                      message.type === "entrance")
                  ) {
                    this.setState({ room: message["new_room_obj"] });
                  } else {
                    let message_body = {
                      content: message["content"],
                      user: message["user"],
                    };
                    let messages_arr = this.state.messages;
                    messages_arr.push(message_body);
                    this.setState(
                      { messages: messages_arr },
                      this.scrollToBottom
                    );
                  }
                };
              })
              .catch((err) => {
                localStorage.removeItem("token");
                console.error("ERROR FETCHING ROOM\n" + err);
              });
          })
          .catch((err) => {
            console.error("Error adding user to room\n" + err);
          });
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.log("ERROR FETCHING CURRENT USER\n" + err);
      });
  }

  onEnterHandler = (event) => {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      event.preventDefault();
      this.onClickHandler(event);
    }
  };

  onClickHandler(event) {
    event.preventDefault();
    var input = this.state.message_draft;
    if (input.length > 0) {
      var message_obj = {
        content: input,
        user: { username: this.state.currentUser },
        room_name: this.state.room_name,
      };
      if (client !== null) {
        client.send(JSON.stringify(message_obj));
        this.setState({ message_draft: "" }, this.scrollToBottom);
      } else {
        checkWebSocket(this.state.currentUser, this.state.room_name);
      }
    }
  }

  render() {
    const input_text_style = {
      padding: "10px",
      paddingLeft: "25px",
      paddingRight: "25px",
      width: "600px",
      borderRadius: "3em",
      outline: "none",
      border: `2px solid ${defaultTheme.palette.error.main}`,
      fontWeight: 400,
      fontSize: fontSizes.medium,
      fontFamily: defaultTheme.typography.primaryFontFamily,
      color: defaultTheme.palette.grey[400],
    };
    const { isLoaded, room, messages } = this.state;
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
              id="message-list"
            >
              <Stack space="medium" width="800px">
                {messages.map((message, index) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection:
                          message.user.username === this.state.currentUser
                            ? "row"
                            : "row-reverse",
                        float:
                          message.user.username === this.state.currentUser
                            ? "right"
                            : "left",
                        textAlign:
                          message.user.username === this.state.currentUser
                            ? "right"
                            : "left",
                        marginLeft:
                          message.user.username === this.state.currentUser
                            ? "400px"
                            : "auto",
                        marginRight:
                          message.user.username === this.state.currentUser
                            ? "auto"
                            : "400px",
                      }}
                    >
                      <Box
                        marginX="large"
                        padding="small"
                        backgroundColor={
                          message.user.username === this.state.currentUser
                            ? defaultTheme.palette.error.main
                            : defaultTheme.palette.primary.main
                        }
                        color={
                          message.user.username === this.state.currentUser
                            ? defaultTheme.palette.common.white
                            : defaultTheme.palette.common.white
                        }
                        roundedCorners
                        marginBottom="small"
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
            <Row width="800px" padding="medium" space="small">
              <Box padding="small">
                <input
                  id="messageText"
                  style={input_text_style}
                  value={this.state.message_draft}
                  onChange={this.onInputChange}
                  onKeyUp={(e) => this.onEnterHandler(e)}
                  autocomplete="off"
                />
              </Box>
              <Box paddingY="small">
                <Button
                  variant="outline"
                  color="error"
                  size="medium"
                  style={{
                    border: `2px solid ${defaultTheme.palette.error.main}`,
                  }}
                  text="Send"
                  onClick={this.onClickHandler}
                />
              </Box>
            </Row>
          </Stack>
          <Box
            padding="medium"
            roundedCorners
            style={{
              overflow: "scroll",
              height: "600px",
              width: "800px",
            }}
          >
            <Stack space="small">
              <Box>
                <h1>Room Members</h1>
              </Box>
              {room.members.map((member, index) => {
                return (
                  <Box
                    padding="small"
                    color={defaultTheme.palette.common.black}
                    marginBottom="small"
                    textAlign="center"
                    key={{ index }}
                    roundedCorners
                  >
                    {member.username}
                  </Box>
                );
              })}
            </Stack>
          </Box>
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
                  onKeyUp={(e) => this.onEnterHandler(e)}
                  onChange={this.onInputChange}
                  placeholder="Message"
                />
 */
