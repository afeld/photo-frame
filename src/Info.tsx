import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Info.css";

interface Props {
  closeInfo(): void;
}

export default class Info extends Component<Props> {
  closeInfo = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    this.props.closeInfo();
    // don't add the hash
    event.preventDefault();
  };

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
        <p>This is Aidan Feldman's Photo Frame app.</p>
        <p>
          The app will show Facebook photos that you have uploaded or are tagged
          in, as well as those from any friends that authorize the app.
        </p>
        <p>
          Source code is available{" "}
          <a href="https://github.com/afeld/photo-frame">here</a>.
        </p>
      </div>
    );
  }
}
