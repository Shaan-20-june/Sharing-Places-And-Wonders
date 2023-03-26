import React from "react";

// Import all Components here

// Import all CSS files here
import "./MainHeader.css";

const MainHeader = (props) => {
  return <header className="main-header">{props.children}</header>;
};

export default MainHeader;
