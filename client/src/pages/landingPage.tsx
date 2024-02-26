import React from "react";
import { getGoogleOAuthURL } from "../utils";

function LandingPage() {
  return (
    <div className="App">
      <header className="App-header">
        <a href={getGoogleOAuthURL()}>Login with Google</a>
      </header>
    </div>
  );
}

export default LandingPage;
