const appConfig = {
  oauth: {
    redirectURI: process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL,
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  },
  apis:{
    backendURI: process.env.REACT_APP_BACKEND_URI
  }
};

export default appConfig;
