import React, { Component } from "react";

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
  toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      const el = this.props.wrapperRef.current;
      if (el) {
        el.requestFullscreen().catch(err => {
          alert(
            `Error attempting to enable full-screen mode: ${err.message} (${
              err.name
            })`
          );
        });
      }
    }
  };

  render() {
    return (
      <a className="fullscreen-toggle" href="#" onClick={this.toggleFullscreen}>
        <i
          className="fas fa-expand-arrows-alt fa-lg"
          title="Toggle fullscreen"
        />
      </a>
    );
  }
}
