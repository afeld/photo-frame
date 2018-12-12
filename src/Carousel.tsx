import React, { Component } from "react";

interface Props {
  FB: fb.FacebookStatic;
}

interface Image {
  source: string;
}

interface Photo {
  id: string;
  images: Array<Image>;
}

export default class Carousel extends Component<Props> {
  state = { photos: [] as Photo[] };

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
      const url = photo.images[0].source;
      return <img key={photo.id} src={url} />;
    });
  }
}
