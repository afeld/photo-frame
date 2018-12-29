import React from "react";
import { StyleSheet, View } from "react-native";
import { Facebook } from "expo";
import Img from "./Img";
import Login from "./Login";
import { getFriendsAndPhotos } from "./Photos";

export default class App extends React.Component {
  state = { img: null };

  logIn = async (response: Facebook.Response) => {
    if (response.type === "success") {
      const { photos } = await getFriendsAndPhotos(response.token);
      const img = photos[0].images[0];
      this.setState({ img });
    } else {
      // type === 'cancel'
    }
  };

  render() {
    let img;
    if (this.state.img) {
      img = <Img img={this.state.img} />;
    }

    return (
      <View style={styles.container}>
        <Login onLogin={this.logIn} />
        {img}
      </View>
    );
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
