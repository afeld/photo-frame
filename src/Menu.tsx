import React, { Component } from "react";
import FullscreenToggle from "./FullscreenToggle";
import "./Menu.css";

interface Props {
  fullscreenEl: React.RefObject<HTMLDivElement>;
}

export default class Menu extends Component<Props> {
  render() {
    return (
      <ul className="menu">
        <li>
          <FullscreenToggle wrapperRef={this.props.fullscreenEl} />
        </li>
      </ul>
    );
  }
}
