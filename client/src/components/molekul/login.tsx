import React from "react";
import { useMutation } from "react-query";
import * as Yup from "yup";
import { useFormik } from "formik";
import backendInteractor from "../../app/api";
import GoogleOAuthButton from "../atom/googleOAuthButton";

type TLoginPayload = {
  email: string;
  password: string;
};
const Login = () => {
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
  const { mutate: handleLogin, isLoading } = useMutation(
    async (loginPayload: TLoginPayload) =>
      backendInteractor.login(loginPayload),
    {
      onSuccess(data) {
        console.log(data);
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
      <GoogleOAuthButton />
    </div>
  );
};

export default Login;
