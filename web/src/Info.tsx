import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InfoText from "./InfoText";
import "./Info.css";

interface Props {
  closeInfo(): void;
  friends: pf.User[];
}

export default class Info extends Component<Props> {
  closeInfo = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    this.props.closeInfo();
    // don't add the hash
    event.preventDefault();
  };

  renderFriend(friend: pf.User) {
    return (
      <li key={friend.id}>
        <a href={friend.link}>
          <img
            className="friend-pic"
            src={friend.picture.data.url}
            alt="Profile picture"
          />{" "}
          {friend.name}
        </a>
      </li>
    );
  }

  renderFriends() {
    if (this.props.friends.length) {
      const friends = this.props.friends.map(this.renderFriend);
      return (
        <div>
          <p>Friends using the app:</p>
          <ul>{friends}</ul>
        </div>
      );
    }
    return "No friends have signed in to Photo Frame.";
  }

  render() {
    return (
      <div className="app-info">
        <a className="close-button" href="#" onClick={this.closeInfo}>
          <FontAwesomeIcon
            icon={faTimes}
            size="3x"
            title="Close information panel"
          />
        </a>
        <InfoText />
        {this.renderFriends()}
      </div>
    );
  }
}
