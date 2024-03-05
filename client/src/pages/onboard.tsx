import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

import { useAuth } from "../app/context/AuthProvider";
import BackendInteractor from "../app/api";

const Onboard = () => {
  const context = useAuth();
  const backendInteractor = new BackendInteractor(context.token);
  const navigate = useNavigate();
  const { mutate } = useMutation(async () => backendInteractor.profile(), {
    async onSuccess(user) {
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    },
  });
  mutate();
  return <div>OnBoarding you please wait</div>;
};
export default Onboard;
