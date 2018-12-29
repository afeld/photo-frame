import React from "react";
import { StyleSheet, View } from "react-native";
import { Facebook, SecureStore } from "expo";
import Img from "./Img";
import Login from "./Login";
import { getFriendsAndPhotos } from "./Photos";

export default class App extends React.Component {
  state = { img: null, token: null };

  constructor(props) {
    super(props);
    this.getImages();
  }

  logIn = async (response: Facebook.Response) => {
    if (response.type === "success") {
      await SecureStore.setItemAsync("fb_token", response.token);
      this.getImages();
    } else {
      // type === 'cancel'
    }
  };

  async fetchSavedToken() {
    const token = await SecureStore.getItemAsync("fb_token");
    // TODO check expiration and scopes
    return token;
  }

  async getImages() {
    const token = await this.fetchSavedToken();
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
