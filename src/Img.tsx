/// <reference path="react-app-env.d.ts" />
import React, { Component } from "react";

interface Props {
  photo: pf.Photo;
}

export default class Img extends Component<Props> {
  render() {
    const url = this.props.photo.images[0].source;
    return <img src={url} />;
  }
}
