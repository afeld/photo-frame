import React, { Component } from "react";
import "./Img.css";

interface Props {
  photo: pf.Photo;
}

export default class Img extends Component<Props> {
  render() {
    const photo = this.props.photo;
    const url = photo.webp_images[0].source;
    return <img alt={photo.name} className="img" src={url} />;
  }
}
