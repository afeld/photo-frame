import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Facebook } from "expo";
import { FACEBOOK_ID } from "../web/src/App";
import { SCOPES } from "../web/src/Perms";

interface Props {
  onLogin(response: Facebook.Response): void;
}

export default class Login extends React.Component<Props> {
  logIn = async () => {
    const response = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_ID, {
      permissions: Array.from(SCOPES)
    });
    this.props.onLogin(response);
  };

  render() {
    return (
      <View>
        <Text>Open up App.js to start working on your app!</Text>
        <Button onPress={this.logIn} title="Log in with Facebook" />
      </View>
    );
  }
}
