import React from "react";
import {
  Box,
  Button,
  Row,
  Stack,
  //Input,
  defaultTheme,
  fontSizes,
} from "luxor-component-library";
import { get_room } from "../api/rooms";
import { get_user_from_token } from "../api/auth";
import axios from "axios";

var room_name = window.location.pathname.split("/")[
  window.location.pathname.split("/").length - 1
];

var client = null;

function checkWebSocket(username) {
  if (client === null || client.readyState === WebSocket.CLOSED) {
    room_name = window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ];
    client = new WebSocket(
      "ws://localhost:8000/ws/" + room_name + "/" + username
    );
  }
}

class ChatModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: {},
      isLoaded: false,
      currentUser: this.props.user,
      message_draft: "",
      messages: [],
    };
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(event) {
    this.setState({ message_draft: event.target.value });
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
        // Fetch room, set messages, users
        instance
          .get(get_room + "/" + room_name)
          .then((response) => {
            //console.log("Room info: \n" + response.data);
            this.setState({ ...response.data, isLoaded: true });
            if (client == null) {
              client = new WebSocket(
                "ws://localhost:8000/ws/" + room_name + "/" + res.data.username
              );
            }
            this.setState({
              currentUser: res.data.username,
              user: res.data,
            });
            client.onopen = () => {
              console.log("WebSocket Client Connected");
            };
            client.onmessage = (event) => {
              let message = JSON.parse(event.data);
              //console.log(message);
              let message_body = {
                content: message["content"],
                user: message["user"],
              };
              let messages_arr = this.state.messages;
              messages_arr.push(message_body);
              this.setState({ messages: messages_arr });
            };
          })
          .catch((err) => {
            console.log("ERROR FETCHING ROOM\n" + err);
          });
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.log("ERROR FETCHING CURRENT USER\n" + err);
      });
  }

  onClickHandler(event) {
    event.preventDefault();
    room_name = window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ];
    var input = this.state.message_draft;
    if (input.length > 0) {
      var message_obj = {
        content: input,
        user: { username: this.state.currentUser },
        room_name: room_name,
      };
      if (client !== null) {
        client.send(JSON.stringify(message_obj));
        this.setState({ message_draft: "" });
      } else {
        checkWebSocket(this.state.currentUser);
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
                  id="messageText"
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
