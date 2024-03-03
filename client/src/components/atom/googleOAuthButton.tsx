import React from "react";
import GoogleIcon from "../../assets/googleIcon.svg";
import { getGoogleOAuthURL } from "../../utils";

const GoogleOAuthButton = () => {
  return (
    <div>
      <button
        type="button"
        style={{ cursor: "pointer" }}
        onClick={() => window.open(getGoogleOAuthURL(), "_self")}
        // onClick={() =>
        //   window.open(
        //     getGoogleOAuthURL(),
        //     "Google OAuth",
        //     "width=500,height=500"
        //   )
        // }
      >
        Sign In with Google{" "}
        <img
          src={GoogleIcon}
          alt="google-icon"
          style={{ width: 20, height: 20 }}
        />
      </button>
    </div>
  );
};
export default GoogleOAuthButton;
