import React from "react";
import axios from "axios";
import { create_room, get_rooms, get_room } from "../api/rooms";
import { get_user_from_token } from "../api/auth";
import { Box, Stack, Button, defaultTheme } from "luxor-component-library";
import { Redirect } from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      currentUser: null,
      roomNav: false,
    };
  }

  startNewRoomClick(e) {
    e.preventDefault();
    let body = {
      room_name: "test_room",
      username: this.state.currentUser,
    };
    let token = localStorage.getItem("token");
    const instance = axios.create({
      timeout: 1000,
      headers: { Authorization: `Bearer ${token}` },
    });
    instance
      .put(create_room, body)
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          this.setState({ roomNav: response.data.room_name });
        }
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.log("ERROR FETCHING SINGLE ROOM: \n" + err);
      });
  }

  handleRoomClick(e) {
    e.preventDefault();
    let room_name = e.currentTarget.textContent;
    let token = localStorage.getItem("token");
    const instance = axios.create({
      timeout: 1000,
      headers: { Authorization: `Bearer ${token}` },
    });
    instance
      .get(get_room + "/" + room_name)
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          this.setState({ roomNav: response.data.room_name });
        }
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.log("ERROR FETCHING SINGLE ROOM: \n" + err);
      });
  }

  componentDidMount() {
    // Setup redux and snag the current user and bring them into state
    // Fetch all rooms (need to setup credentials from current user)
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
        this.setState({
          currentUser: response.data.username,
        });
        instance
          .get(get_rooms)
          .then((response) => {
            this.setState({ rooms: response.data });
          })
          .catch((err) => {
            // clear token just in case
            localStorage.removeItem("token");
            console.log("ERROR FETCHING ROOMS: \n" + err);
          });
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.log("ERROR FETCHING CURRENT USER\n" + err);
      });
  }

  render() {
    const { rooms, roomNav } = this.state;
    if (roomNav && roomNav !== "None") {
      return <Redirect push to={"/dashboard/" + roomNav} />;
    } else {
      return (
        <Box
          margin="0"
          backgroundColor={defaultTheme.palette.grey[100]}
          textAlign="center"
        >
          <Stack space="small" padding="medium">
            <Box padding="medium">
              <h1>Welcome Home</h1>
            </Box>
            <Box marginX="xxxlarge">
              <Button
                variant="solid"
                size="medium"
                color="primary"
                text="Start a room"
                onClick={(e) => this.startNewRoomClick(e)}
              />
            </Box>
            <Box>
              <h2>Rooms</h2>
              <Stack>
                {rooms.map((room, index) => {
                  return (
                    <Button
                      padding="small"
                      backgroundColor={defaultTheme.palette.primary.main}
                      roundedCorners
                      marginX="xxxlarge"
                      key={{ index }}
                      text={room.room_name}
                      id={room.room_name}
                      onClick={(e) => this.handleRoomClick(e)}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        </Box>
      );
    }
  }
}

export default Home;
