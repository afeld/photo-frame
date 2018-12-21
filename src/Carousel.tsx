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

interface FBBatchResponse {
  body: string;
}

interface FBError {
  message: string;
}

interface PhotosResponse {
  data?: pf.Photo[];
  error?: FBError;
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

  onPhotosFetched = (responses: FBBatchResponse[]) => {
    let photos = responses.reduce(
      (acc, response) => {
        if (!response) {
          return acc;
        }
        const json = JSON.parse(response.body) as PhotosResponse;
        if (json.error) {
          console.error(json.error.message);
        }
        return Object.values(json).reduce(
          (innerAcc, photoRes) => innerAcc.concat(photoRes.data),
          acc
        );
      },
      [] as pf.Photo[]
    );

    photos = shuffle(photos);
    photos = uniqBy(photos, photo => photo.id);

    this.setState({ photos });
    this.start();
  };

  fetchPhotos() {
    // batch requests
    // https://stackoverflow.com/a/16001318/358804
    // https://developers.facebook.com/docs/graph-api/making-multiple-requests#operations
    // https://developers.facebook.com/docs/graph-api/advanced#largerequests
    this.props.FB.api(
      "/",
      "post",
      {
        include_headers: false,
        batch: [
          {
            method: "GET",
            name: "friends",
            relative_url: "me/friends?fields=id"
          },
          // tagged photos
          {
            method: "GET",
            relative_url:
              "photos?fields=name,webp_images&ids=me,{result=friends:$.data.*.id}"
          },
          // uploaded photos
          {
            method: "GET",
            relative_url:
              "photos?type=uploaded&fields=name,webp_images&ids=me,{result=friends:$.data.*.id}"
          }
        ]
      },
      this.onPhotosFetched
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
        FB={this.props.FB}
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
