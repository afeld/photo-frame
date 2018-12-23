import React, { Component } from "react";
import Fullscreen from "react-full-screen";
import shuffle from "lodash.shuffle";
import Img from "./Img";
import Info from "./Info";
import Menu from "./Menu";
import { getFriendsAndPhotos } from "./Photos";

interface Props {
  FB: fb.FacebookStatic;
}

interface State {
  currentPhoto?: number;
  friends: pf.User[];
  isFullscreen: boolean;
  menuVisible: boolean;
  photos: pf.Photo[];
  showInfo: boolean;
}

const DELAY = 30 * 1000; // ms

export default class Carousel extends Component<Props, State> {
  // https://stackoverflow.com/a/51305453/358804
  state: Readonly<State> = {
    friends: [],
    isFullscreen: false,
    menuVisible: true,
    photos: [],
    showInfo: false
  };

  componentDidMount() {
    this.fetchPhotos();
  }

  start() {
    if (
      // already started
      typeof this.state.currentPhoto === "number" ||
      // no photos
      !this.state.photos.length
    ) {
      return;
    }
    this.setState({ currentPhoto: 0 });
    setInterval(this.advance.bind(this), DELAY);
  }

  onFriendsAndPhotosFetched = (friends: pf.User[], photos: pf.Photo[]) => {
    photos = shuffle(photos);
    this.setState({ friends, photos });
    this.start();
  };

  fetchPhotos() {
    getFriendsAndPhotos(this.props.FB, this.onFriendsAndPhotosFetched);
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

  showInfo = () => {
    this.setState({ showInfo: true });
  };

  closeInfo = () => {
    this.setState({ showInfo: false });
  };

  toggleMenu = () => {
    const menuVisible = !this.state.menuVisible;
    this.setState({ menuVisible });
    if (menuVisible) {
      setTimeout(() => {
        this.setState({ menuVisible: false });
      }, 3000);
    }
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
    if (this.state.showInfo) {
      return <Info closeInfo={this.closeInfo} friends={this.state.friends} />;
    }

    const menu = this.state.menuVisible ? (
      <Menu
        FB={this.props.FB}
        isFullscreen={this.isFullscreen}
        showInfo={this.showInfo}
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
