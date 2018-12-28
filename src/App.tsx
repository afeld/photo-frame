import React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { Facebook } from "expo";
import { FACEBOOK_ID } from "../web/src/App";
import { SCOPES } from "../web/src/Perms";
import { getFriendsAndPhotos } from "./Photos";

export default class App extends React.Component {
  state = {
    img: null
  };

  logIn = async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      FACEBOOK_ID,
      {
        permissions: Array.from(SCOPES)
      }
    );
    if (type === "success") {
      const { photos } = await getFriendsAndPhotos(token);
      const img = photos[0].images[0];
      this.setState({ img });
    } else {
      // type === 'cancel'
    }
  };

  render() {
    let img;
    if (this.state.img) {
      img = (
        <Image
          style={{ width: this.state.img.width, height: this.state.img.height }}
          source={{ uri: this.state.img.source }}
        />
      );
    }

    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Button onPress={this.logIn} title="Log in with Facebook" />
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
