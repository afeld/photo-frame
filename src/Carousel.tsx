import React, { Component } from "react";
import { shuffle } from "lodash";
import Img from "./Img";
import { getFriendsAndPhotos, pf } from "./Photos";

interface Props {
  token: string;
}

interface State {
  currentPhoto?: number;
  friends: pf.User[];
  photos: pf.Photo[];
}

const DELAY = 30 * 1000; // ms

export default class Carousel extends Component<Props, State> {
  // https://stackoverflow.com/a/51305453/358804
  state: Readonly<State> = {
    friends: [],
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

  onFriendsAndPhotosFetched = (friends: pf.User[], photos: pf.Photo[]) => {
    photos = shuffle(photos);
    this.setState({ friends, photos });
    this.start();
  };

  async fetchPhotos() {
    const { friends, photos } = await getFriendsAndPhotos(this.props.token);
    this.onFriendsAndPhotosFetched(friends, photos);
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
    // TODO pick size more strategically
    const img = photo.images[0];
    return <Img img={img} />;
  }

  render() {
    return this.img();
  }
}
