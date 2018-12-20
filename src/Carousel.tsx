import React, { Component } from "react";
import shuffle from "lodash.shuffle";
import Img from "./Img";
import Menu from "./Menu";
import "./Carousel.css";

interface Props {
  FB: fb.FacebookStatic;
}

interface State {
  currentPhoto?: number;
  photos: pf.Photo[];
}

interface PhotosResponse {
  data: pf.Photo[];
}

const DELAY = 30 * 1000; // ms

export default class Carousel extends Component<Props, State> {
  // https://stackoverflow.com/a/51305453/358804
  state: Readonly<State> = { photos: [] };

  wrapperRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    this.fetchPhotos();
  }

  fetchPhotos() {
    this.props.FB.api(
      "me/photos",
      { fields: "name,webp_images" },
      (response: PhotosResponse) => {
        const photos = shuffle(response.data);
        this.setState({ currentPhoto: 0, photos });
        setInterval(this.advance.bind(this), DELAY);
      }
    );
  }

  nextPhotoIndex() {
    let result = this.state.currentPhoto;
    if (result === undefined) {
      return result;
    }
    result = result || 0;
    result += 1;
    if (result >= this.state.photos.length) {
      // restart
      result = 0;
    }
    return result;
  }

  advance() {
    const next = this.nextPhotoIndex();
    if (next) {
      this.setState({ currentPhoto: next });
    }
  }

  img() {
    if (this.state.currentPhoto === undefined) {
      return null;
    }
    const photo = this.state.photos[this.state.currentPhoto];
    return <Img photo={photo} />;
  }

  preloader() {
    const nextPhotoIndex = this.nextPhotoIndex();
    if (nextPhotoIndex === undefined) {
      return null;
    }
    const photo = this.state.photos[nextPhotoIndex];
    return <Img className="preloader" photo={photo} />;
  }

  render() {
    return (
      <div className="carousel" ref={this.wrapperRef}>
        {this.img()}
        <Menu fullscreenEl={this.wrapperRef} />
        {this.preloader()}
      </div>
    );
  }
}
