import React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { Facebook } from "expo";
import { FACEBOOK_ID } from "../web/src/App";
import { SCOPES } from "../web/src/Perms";

export default class App extends React.Component {
  state = {
    img: null
  };

  logIn = async () => {
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        FACEBOOK_ID,
        {
          permissions: Array.from(SCOPES)
        }
      );
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me/photos?access_token=${token}&fields=name,images`
        );
        const json = await response.json();
        const img = json.data[0].images[0];
        this.setState({ img });
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
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
