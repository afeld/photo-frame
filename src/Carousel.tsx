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
    return this.state.photos.map(photo => {
      return <Img key={photo.id} photo={photo} />;
    });
  }
}
