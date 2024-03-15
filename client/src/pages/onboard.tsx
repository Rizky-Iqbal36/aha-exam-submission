import React, { useEffect } from "react";
import { Cookies } from "react-cookie";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../app/context/AuthProvider";
import BackendInteractor from "../app/api";

const Onboard = () => {
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const token = searchParam.get("token") ?? "";
  const context = useAuth();
  useEffect(() => {
    if (!token) {
      window.alert("Token Required");
      navigate("/");
    }

    const backendInteractor = new BackendInteractor(token);
    backendInteractor
      .profile()
      .then((data) => {
        const cookies = new Cookies();
        context.setToken(token);
        cookies.set("accessToken", token, { maxAge: 1000 * 60 * 60 * 24 * 30 });
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/dashboard");
      })
      .catch((err) => {
        const data = err.response.data;
        window.alert(data.desc);
        navigate("/");
      });
  }, []);
  return <div>OnBoarding you please wait</div>;
};
export default Onboard;
