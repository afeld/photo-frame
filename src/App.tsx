import React from "react";
import { StyleSheet, View } from "react-native";
import { Facebook } from "expo";
import Carousel from "./Carousel";
import Login from "./Login";
import { saveToken, fetchToken } from "./TokenStore";

export default class App extends React.Component {
  state = { token: null as string };

  constructor(props) {
    super(props);
    this.fetchToken();
  }

  async fetchToken() {
    const token = await fetchToken();
    if (token) {
      this.setState({ token });
    }
  }

  logIn = async (response: Facebook.Response) => {
    if (response.type === "success") {
      await saveToken(response.token);
      this.setState({ token: response.token });
    } else {
      // type === 'cancel'
    }
  };

  render() {
    const body = this.state.token ? (
      <Carousel token={this.state.token} />
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
