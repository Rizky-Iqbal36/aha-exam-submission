import React from "react";
import { useMutation } from "react-query";
import * as Yup from "yup";
import { useFormik } from "formik";
import BackendInteractor from "../../app/api";
import GoogleOAuthButton from "../atom/googleOAuthButton";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { TAuthPayload } from "../../interfaces";
import { useAuth } from "../../app/context/AuthProvider";

const Login = () => {
  const backendInteractor = new BackendInteractor();
  const navigate = useNavigate();
  const { handleSubmit, getFieldProps, errors, touched } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email required")
        .email("invalid format email!"),
      password: Yup.string().required("Password Required").min(8),
    }),
    onSubmit: (values) => handleLogin(values),
  });
  const context = useAuth();
  const { mutate: handleLogin, isLoading } = useMutation(
    async (loginPayload: TAuthPayload) =>
      backendInteractor.auth("login", loginPayload),
    {
      async onSuccess({ user, token }: { user: any; token: string }) {
        const cookies = new Cookies();
        context.setToken(token);
        cookies.set("accessToken", token);

        localStorage.setItem("user", JSON.stringify(await user));

        navigate("/dashboard");
      },
      onError(err: any) {
        const data = err.response.data;
        window.alert(data.desc);
      },
    }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Welcome Back</p>
        <div>
          <input type="email" placeholder="Email" {...getFieldProps("email")} />
        </div>
        {touched.email && errors.email ? (
          <p style={{ color: "red", fontSize: 16, padding: 0, margin: 0 }}>
            {errors.email}
          </p>
        ) : null}
        <div>
          <input
            type="password"
            placeholder="Password"
            {...getFieldProps("password")}
          />
        </div>
        {touched.password && errors.password ? (
          <p style={{ color: "red", fontSize: 16, padding: 0, margin: 0 }}>
            {errors.password}
          </p>
        ) : null}
        <button type="submit" style={{ margin: 5 }} disabled={isLoading}>
          {isLoading ? "Loading" : "Log In"}
        </button>
      </form>
      <p style={{ fontSize: 11 }}>---------------or---------------</p>
      <GoogleOAuthButton placeholder="Sign In with Google" />
    </div>
  );
};

export default Login;
