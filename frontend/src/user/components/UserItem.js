import React from "react";
import { Link } from "react-router-dom";

// Import all Components here
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";

// Import all CSS files here
import "./UserItem.css";

// Component Logic
const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar
              image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              name={props.name}
            />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount > 1 ? "Places" : "Place"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
