import React, { Component } from "react";
import FBLogin from "./FBLogin";
import logo from "./logo.svg";
import "./App.css";

interface Props {
  FB: fb.FacebookStatic;
}

class App extends Component<Props> {
  state = { loggedIn: false };

  componentDidMount() {
    this.props.FB.init({
      appId: "301045530751709",
      status: true,
      version: "v3.2"
    });

    this.props.FB.AppEvents.logPageView();
    this.props.FB.getLoginStatus(this.onLogin);
  }

  onLogin = (response: fb.StatusResponse) => {
    console.log(response);
    if (response.status === "connected") {
      this.setState({ loggedIn: true });
    }
  };

  render() {
    const login = this.state.loggedIn ? null : (
      <FBLogin FB={this.props.FB} onLoggedIn={this.onLogin} />
    );

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {login}
        </header>
      </div>
    );
  }
}

export default App;
