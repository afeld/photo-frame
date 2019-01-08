import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import FullscreenToggle from "./FullscreenToggle";

interface Props {
  FB: fb.FacebookStatic;
  isFullscreen(): boolean;
  showInfo(): void;
  toggleFullscreen(): void;
}

export default class Menu extends Component<Props> {
  logout = () => {
    this.props.FB.logout(() => {
      document.location.reload();
    });
  };

  render() {
    return (
      <ul className="menu" onClick={e => e.stopPropagation()}>
        <li>
          <a href="#" onClick={this.props.showInfo}>
            <FontAwesomeIcon
              icon={faInfoCircle}
              size="2x"
              title="Show information panel"
            />
          </a>
        </li>
        <li>
          <FullscreenToggle
            isFullscreen={this.props.isFullscreen}
            toggleFullscreen={this.props.toggleFullscreen}
          />
        </li>
        <li>
          <a href="#" onClick={this.logout}>
            <FontAwesomeIcon icon={faSignOutAlt} size="2x" title="Sign out" />
          </a>
        </li>
      </ul>
    );
  }
}
