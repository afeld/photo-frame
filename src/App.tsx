import React from "react";
import { StyleSheet, View } from "react-native";
import { Facebook } from "expo";
import Img from "./Img";
import Login from "./Login";
import { saveToken, fetchToken } from "./TokenStore";
import { getFriendsAndPhotos } from "./Photos";

export default class App extends React.Component {
  state = { img: null };

  constructor(props) {
    super(props);
    this.getImages();
  }

  logIn = async (response: Facebook.Response) => {
    if (response.type === "success") {
      await saveToken(response.token);
      this.getImages();
    } else {
      // type === 'cancel'
    }
  };

  async getImages() {
    const token = await fetchToken();
    if (!token) {
      return;
    }
    const { photos } = await getFriendsAndPhotos(token);
    const img = photos[0].images[0];
    this.setState({ img });
  }

  render() {
    const body = this.state.img ? (
      <Img img={this.state.img} />
    ) : (
      <Login onLogin={this.logIn} />
    );

    return <View style={styles.container}>{body}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
