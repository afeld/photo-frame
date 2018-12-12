import React, { Component } from "react";
import "./Img.css";

interface Props {
  photo: pf.Photo;
}

export default class Img extends Component<Props> {
  sizeStr(img: pf.Image, i: number, images: pf.Image[]) {
    // media condition "must be omitted for the last item"
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes
    if (i === images.length - 1) {
      return `${img.width}w`;
    }
    return `(max-width: ${img.width}px and max-height: ${img.height}px) ${
      img.width
    }w`;
  }

  srcsetStr(img: pf.Image) {
    return `${img.source} ${img.width}w`;
  }

  render() {
    const photo = this.props.photo;
    const images = photo.webp_images;
    // the largest one - they are in descending order
    const url = images[0].source;

    // make images responsive
    const sizes = images.map(this.sizeStr).join(", ");
    const srcset = images.map(this.srcsetStr).join(", ");

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
