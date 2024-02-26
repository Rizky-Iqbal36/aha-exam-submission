import React from "react";
import "./App.css";

function getGoogleOAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL,
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options as any);

  return `${rootUrl}?${qs.toString()}`;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a href={getGoogleOAuthURL()}>Login with Google</a>
      </header>
    </div>
  );
}

export default App;
