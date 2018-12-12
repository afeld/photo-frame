import React, { Component } from "react";
import "./Img.css";

interface Props {
  photo: pf.Photo;
}

export default class Img extends Component<Props> {
  render() {
    const photo = this.props.photo;
    const images = photo.webp_images;
    const url = images[0].source;

    // make images responsive
    const sizes = images
      .map((img, i) => {
        if (i === images.length - 1) {
          return `${img.width}w`;
        }
        return `(min-width: ${img.width}px and min-height: ${img.height}px) ${
          img.width
        }w`;
      })
      .join(", ");
    const srcset = images
      .map((img, i) => {
        return `${img.source} ${img.width}w`;
      })
      .join(", ");

    return (
      <img
        alt={photo.name}
        className="img"
        sizes={sizes}
        src={url}
        srcSet={srcset}
      />
    );
  }
}
