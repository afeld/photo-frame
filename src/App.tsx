import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { Facebook } from "expo";
import { FACEBOOK_ID } from "../web/src/App";
import { SCOPES } from "../web/src/Perms";

export default class App extends React.Component {
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
          `https://graph.facebook.com/me?access_token=${token}`
        );
        Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Button onPress={this.logIn} title="Log in with Facebook" />
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
