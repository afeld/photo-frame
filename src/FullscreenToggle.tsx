import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompress,
  faExpandArrowsAlt
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  wrapperRef: React.RefObject<HTMLDivElement>;
}

// https://github.com/Microsoft/TSJS-lib-generator/pull/597
declare global {
  interface Document {
    fullscreenElement: Element | null;
  }
}

export default class FullscreenToggle extends Component<Props> {
  // mirror document.fullscreen, but in the state so a change forces re-render
  state = { isFullscreen: false };

  onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (this.state.isFullscreen) {
      document.exitFullscreen();
      this.setState({ isFullscreen: false });
    } else {
      const el = this.props.wrapperRef.current;
      if (el) {
        el.requestFullscreen()
          .then(() => {
            this.setState({ isFullscreen: true });
          })
          .catch(err => {
            alert(
              `Error attempting to enable full-screen mode: ${err.message} (${
                err.name
              })`
            );
          });
      }
    }
    event.preventDefault();
  };

  render() {
    if (!document.fullscreenEnabled) {
      // not supported
      return null;
    }
    const icon = this.state.isFullscreen ? faCompress : faExpandArrowsAlt;
    const title = this.state.isFullscreen
      ? "Make fullscreen."
      : "Exit fullscreen.";
    return (
      <a className="fullscreen-toggle" href="#" onClick={this.onClick}>
        <FontAwesomeIcon icon={icon} size="2x" title={title} />
      </a>
    );
  }
}
