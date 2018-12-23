import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InfoText from "./InfoText";
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
        <InfoText />
      </div>
    );
  }
}
