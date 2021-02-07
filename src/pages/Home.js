import React from "react";
import axios from "axios";
import { get_rooms } from "../api/rooms";
import { Box, Stack, defaultTheme } from "luxor-component-library";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      currentUser: null,
    };
  }

  componentDidMount() {
    // Setup redux and snag the current user and bring them into state
    // Fetch all rooms (need to setup credentials from current user)

    axios
      .get(get_rooms)
      .then((response) => {
        this.setState({ rooms: response.data });
      })
      .catch((err) => {
        console.log("ERROR FETCHING ROOMS: \n" + err);
      });
  }

  render() {
    const { rooms } = this.state;
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
          <Box
            backgroundColor={defaultTheme.palette.common.black}
            color={defaultTheme.palette.common.white}
            margin="0px"
            padding="large"
            height="800px"
          >
            Start a room
          </Box>
          <Box>
            <h2>Rooms</h2>
            <Stack>
              {rooms.map(function (room, index) {
                return (
                  <Box padding="small" key={{ index }}>
                    <b>{room.room_name}</b> :{" "}
                    {room.active ? "Active" : "Inactive"}
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Stack>
      </Box>
    );
  }
}

export default Home;
