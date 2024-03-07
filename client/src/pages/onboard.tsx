import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../app/context/AuthProvider";
import BackendInteractor from "../app/api";

const Onboard = () => {
  const context = useAuth();
  const backendInteractor = new BackendInteractor(context.token);
  const navigate = useNavigate();
  useEffect(() => {
    backendInteractor.profile().then((data) => {
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    });
  }, []);
  return <div>OnBoarding you please wait</div>;
};
export default Onboard;
