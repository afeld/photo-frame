import React from "react";
import { Dimensions, Image } from "react-native";
import { pf } from "./Photos";

interface Props {
  img: pf.Image;
}

export default class Img extends React.Component<Props> {
  render() {
    const { height, width } = Dimensions.get("window");
    const uri = this.props.img.source;

    return (
      <Image
        style={{
          width,
          height,
          resizeMode: "contain",
          backgroundColor: "black"
        }}
        source={{ uri }}
      />
    );
  }
}
