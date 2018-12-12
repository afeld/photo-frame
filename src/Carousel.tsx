import React, { Component } from "react";

interface Props {
  FB: fb.FacebookStatic;
}

interface Image {
  source: string;
}

interface Photo {
  images: Array<Image>;
}

export default class Carousel extends Component<Props> {
  state = { photoUrls: [] };

  componentDidMount() {
    this.fetchPhotos();
  }

  fetchPhotos() {
    this.props.FB.api("me/photos", { fields: "images" }, (response: any) => {
      console.log(response);
      const images = response.data.map(
        (photo: Photo) => photo.images[0].source
      );
      this.setState({ photoUrls: images });
    });
  }

  render() {
    return this.state.photoUrls.map(url => <img src={url} />);
  }
}
