import React, { Component } from "react";
import shuffle from "lodash.shuffle";
import Img from "./Img";
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

// https://github.com/Microsoft/TSJS-lib-generator/pull/597
declare global {
  interface Document {
    fullscreenElement: Element | null;
  }
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

  toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      const carouselEl = this.wrapperRef.current;
      if (carouselEl) {
        carouselEl.requestFullscreen().catch(err => {
          alert(
            `Error attempting to enable full-screen mode: ${err.message} (${
              err.name
            })`
          );
        });
      }
    }
  };

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
        <a
          className="fullscreen-toggle"
          href="#"
          onClick={this.toggleFullscreen}
        >
          <i
            className="fas fa-expand-arrows-alt fa-lg"
            title="Toggle fullscreen"
          />
        </a>
        {this.img()}
        {this.preloader()}
      </div>
    );
  }
}
