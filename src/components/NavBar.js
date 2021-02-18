import React from "react";
import { NavLink } from "react-router-dom";
import { Box, defaultTheme } from "luxor-component-library";

class NavBar extends React.Component {
  render() {
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: defaultTheme.palette.primary.light,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <Box paddingX="small">
          <NavLink
            style={{
              textDecoration: "none",
              color: defaultTheme.palette.common.white,
            }}
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            style={{
              textDecoration: "none",
              color: defaultTheme.palette.common.white,
              marginLeft: "20px",
            }}
            to="/favorites"
          >
            Favorites
          </NavLink>
        </Box>
      </div>
    );
  }
}
export default NavBar;
