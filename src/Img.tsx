import React from "react";
import { Image } from "react-native";
import { pf } from "./Photos";

interface Props {
  img: pf.Image;
}

export default class Img extends React.Component<Props> {
  render() {
    return (
      <Image
        style={{ width: this.props.img.width, height: this.props.img.height }}
        source={{ uri: this.props.img.source }}
      />
    );
  }
}
