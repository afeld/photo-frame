import React, { Component } from "react";
import FullscreenToggle from "./FullscreenToggle";
import "./Menu.css";

interface Props {
  isFullscreen(): boolean;
  toggleFullscreen(): void;
}

export default class Menu extends Component<Props> {
  render() {
    return (
      <ul className="menu" onClick={e => e.stopPropagation()}>
        <li>
          <FullscreenToggle
            isFullscreen={this.props.isFullscreen}
            toggleFullscreen={this.props.toggleFullscreen}
          />
        </li>
      </ul>
    );
  }
}
