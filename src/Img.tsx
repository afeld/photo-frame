import React from "react";
import { Dimensions, Image } from "react-native";
import { pf } from "./Photos";

interface Props {
  img: pf.Image;
}

interface State {
  height: number;
  width: number;
}

export default class Img extends React.Component<Props, State> {
  componentWillMount() {
    this.updateDimensions();
    Dimensions.addEventListener("change", this.updateDimensions);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.updateDimensions);
  }

  updateDimensions = () => {
    const { height, width } = Dimensions.get("window");
    this.setState({ height, width });
  };

  render() {
    const uri = this.props.img.source;

    return (
      <Image
        style={{
          width: this.state.width,
          height: this.state.height,
          resizeMode: "contain",
          backgroundColor: "black"
        }}
        source={{ uri }}
      />
    );
  }
}
