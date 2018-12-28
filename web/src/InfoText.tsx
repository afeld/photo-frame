import React, { Component } from "react";

export default class InfoText extends Component {
  render() {
    return (
      <div className="app-info-text">
        <p>
          This is Aidan Feldman's Photo Frame app. The app will show Facebook
          photos that you have uploaded or are tagged in, as well as those from
          any friends that authorize the app. Source code is available{" "}
          <a href="https://github.com/afeld/photo-frame">here</a>.
        </p>
      </div>
    );
  }
}
