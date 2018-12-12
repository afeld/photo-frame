/// <reference path="react-app-env.d.ts" />
import React, { Component } from "react";
import "./Img.css";

interface Props {
  photo: pf.Photo;
}

export default class Img extends Component<Props> {
  render() {
    const url = this.props.photo.images[0].source;
    return <img className="img" src={url} />;
  }
}
