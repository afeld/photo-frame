import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompress,
  faExpandArrowsAlt
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  isFullscreen(): boolean;
  toggleFullscreen(): void;
}

export default class FullscreenToggle extends Component<Props> {
  render() {
    if (!document.fullscreenEnabled) {
      // not supported
      return null;
    }
    const icon = this.props.isFullscreen() ? faCompress : faExpandArrowsAlt;
    const title = this.props.isFullscreen()
      ? "Make fullscreen."
      : "Exit fullscreen.";
    return (
      <a
        className="fullscreen-toggle"
        href="#"
        onClick={this.props.toggleFullscreen}
      >
        <FontAwesomeIcon icon={icon} size="2x" title={title} />
      </a>
    );
  }
}
