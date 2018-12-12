import React, { Component } from "react";
import Img from "./Img";

interface Props {
  FB: fb.FacebookStatic;
}

interface State {
  displayedPhoto?: pf.Photo;
  photos: pf.Photo[];
}

interface PhotosResponse {
  data: pf.Photo[];
}

const DELAY = 30 * 1000; // ms

export default class Carousel extends Component<Props, State> {
  // https://stackoverflow.com/a/51305453/358804
  state: Readonly<State> = {
    photos: []
  };

  componentDidMount() {
    this.fetchPhotos();
  }

  fetchPhotos() {
    this.props.FB.api(
      "me/photos",
      { fields: "name,webp_images" },
      (response: PhotosResponse) => {
        this.setState({ photos: response.data });
        this.pickPhoto();
        setInterval(this.pickPhoto.bind(this), DELAY);
      }
    );
  }

  pickPhoto() {
    const photos = this.state.photos;
    const index = Math.floor(Math.random() * photos.length);
    const photo = photos[index];
    this.setState({ displayedPhoto: photo });
  }

  render() {
    const img = this.state.displayedPhoto ? (
      <Img photo={this.state.displayedPhoto} />
    ) : null;
    return <div className="carousel">{img}</div>;
  }
}
