import React, { Component } from "react";
import Fullscreen from "react-full-screen";
import shuffle from "lodash.shuffle";
import Img from "./Img";
import Menu from "./Menu";

interface Props {
  FB: fb.FacebookStatic;
}

interface State {
  currentPhoto?: number;
  isFullscreen: boolean;
  menuVisible: boolean;
  photos: pf.Photo[];
}

interface PhotosResponse {
  data: pf.Photo[];
}

const DELAY = 30 * 1000; // ms

export default class Carousel extends Component<Props, State> {
  // https://stackoverflow.com/a/51305453/358804
  state: Readonly<State> = {
    isFullscreen: false,
    menuVisible: true,
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
        const photos = shuffle(response.data);
        this.setState({
          currentPhoto: 0,
          photos
        });
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

  toggleMenu = () => {
    this.setState({ menuVisible: !this.state.menuVisible });
  };

  isFullscreen = () => {
    return this.state.isFullscreen;
  };

  toggleFullscreen = () => {
    this.setState({
      isFullscreen: !this.state.isFullscreen
    });
  };

  preloader() {
    const nextPhotoIndex = this.nextPhotoIndex();
    if (nextPhotoIndex === undefined) {
      return null;
    }
    const photo = this.state.photos[nextPhotoIndex];
    return <Img className="preloader" photo={photo} />;
  }

  render() {
    const menu = this.state.menuVisible ? (
      <Menu
        isFullscreen={this.isFullscreen}
        toggleFullscreen={this.toggleFullscreen}
      />
    ) : null;
    return (
      <Fullscreen
        enabled={this.isFullscreen()}
        onChange={isFullscreen => this.setState({ isFullscreen })}
      >
        <div className="carousel" onClick={this.toggleMenu}>
          {this.img()}
          {menu}
          {this.preloader()}
        </div>
      </Fullscreen>
    );
  }
}
