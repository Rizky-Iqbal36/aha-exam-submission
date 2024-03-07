import React from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/context/AuthProvider";
import BackendInteractor from "../../app/api";

const LogoutButton = () => {
  const context = useAuth();
  const navigate = useNavigate();
  const backendInteractor = new BackendInteractor(context.token);
  const cookies = new Cookies();
  return context.token ? (
    <button
      type="button"
      style={{
        cursor: "pointer",
        margin: 20,
        backgroundColor: "#d9534f",
        color: "white",
        borderRadius: 10,
      }}
      onClick={() => {
        backendInteractor
          .logout()
          .then(() => {
            cookies.remove("accessToken");
            context.setToken("");
            localStorage.removeItem("user");
            window.alert("Success Logout, Redirecting you to home page!");
            navigate("/");
          })
          .catch((err) => {
            const data = err.response.data;
            window.alert(data.desc);
          });
      }}
    >
      Logout
    </button>
  ) : (
    <></>
  );
};
export default LogoutButton;
