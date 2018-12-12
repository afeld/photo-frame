import React, { Component } from "react";
import Img from "./Img";

interface Props {
  FB: fb.FacebookStatic;
}

export default class Carousel extends Component<Props> {
  state = { photos: [] as pf.Photo[] };

  componentDidMount() {
    this.fetchPhotos();
  }

  fetchPhotos() {
    this.props.FB.api("me/photos", { fields: "images" }, (response: any) => {
      this.setState({ photos: response.data });
    });
  }

  render() {
    const photo = this.state.photos.length ? (
      <Img photo={this.state.photos[0]} />
    ) : null;
    return <div className="carousel">{photo}</div>;
  }
}
