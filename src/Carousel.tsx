import React, { Component } from "react";
import Fullscreen from "react-full-screen";
import uniqBy from "lodash.uniqby";
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
  data?: pf.Photo[];
}

interface FBUser {
  id: string;
}

interface FriendsResponse {
  data?: FBUser[];
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

  onPhotosFetched = (response: PhotosResponse) => {
    // merge with previously fetched photos
    const newPhotos = shuffle(response.data);
    let photos = this.state.photos.concat(newPhotos);
    photos = uniqBy(photos, photo => photo.id);

    this.setState({ photos });
    this.start();
  };

  fetchPhotosFor(userId: string) {
    const baseParams = { fields: "name,webp_images" };
    // tagged photos
    this.props.FB.api(`${userId}/photos`, baseParams, this.onPhotosFetched);
    this.props.FB.api(
      `${userId}/photos`,
      { ...baseParams, type: "uploaded" },
      this.onPhotosFetched
    );
  }

  fetchPhotos() {
    this.fetchPhotosFor("me");
    this.props.FB.api(
      "me/friends",
      { fields: "id" },
      (response: FriendsResponse) => {
        const friends = response.data || [];
        friends.forEach(user => {
          this.fetchPhotosFor(user.id);
        });
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
