import React, { Component } from "react";
import Img from "./Img";
import "./Carousel.css";

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

  render() {
    const img = this.state.displayedPhoto ? (
      <Img photo={this.state.displayedPhoto} />
    ) : null;
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
        {img}
      </div>
    );
  }
}
