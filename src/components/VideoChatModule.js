import React from "react";
import {
  Box,
  //Button,
  //Row,
  Stack,
  defaultTheme,
  fontSizes,
} from "luxor-component-library";
import { get_room, put_user_into_room } from "../api/rooms";
import { get_user_from_token } from "../api/auth";
import axios from "axios";
const { connect } = require("twilio-video");

class VideoChatModule extends React.Component {
  constructor(props) {
    super(props);
    this.messagesEndRef = React.createRef();
    this.state = {
      isLoaded: false,
      openEmoji: false,
      currentUser: this.props.user,
      identity: "",
      room: null,
    };
    this.onEnterHandler = this.onEnterHandler.bind(this);
  }
  async joinRoom() {
    try {
      // Get access token
      const response = await fetch(
        `https://{your-endpoint}?identity=${this.state.identity}`
      );
      const data = await response.json();
      // Join Room
      const room = await connect(data.accessToken, {
        name: this.state.room_name,
        audio: true,
        video: true,
      });

      this.setState({ room: room });
    } catch (err) {
      console.log(err);
    }
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
    // Fetch user info and instantiates websocket
    instance
      .get(get_user_from_token)
      .then((res) => {
        this.setState({
          currentUser: res.data.username,
          user: res.data,
        });
        instance
          .put(
            put_user_into_room + "/" + decodeURIComponent(this.props.room_name)
          )
          .then(() => {
            // Fetch room, set messages, users
            instance
              .get(get_room + "/" + decodeURIComponent(this.props.room_name))
              .then((room) => {
                this.setState({ ...room.data, isLoaded: true });
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
        console.error("ERROR FETCHING CURRENT USER\n" + err);
      });
  }

  onEnterHandler = (event) => {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      event.preventDefault();
      console.log("Enter event!");
    }
  };

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
    const { isLoaded, members, room_name } = this.state;
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
        <Stack
          padding="medium"
          roundedCorners
          style={{
            overflow: "scroll",
            height: "600px",
            width: "800px",
          }}
        >
          <Box padding="medium">
            <h1>{room_name} Video Chat</h1>
          </Box>
          {members.map((member, index) => {
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
      );
    }
  }
}
export { VideoChatModule };
