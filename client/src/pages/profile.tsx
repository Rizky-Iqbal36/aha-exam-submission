import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";

import DefaultPP from "../assets/default-pp.jpg";
import BackendInteractor from "../app/api";
import { useMutation } from "react-query";
import { useAuth } from "../app/context/AuthProvider";

const Profile = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") as string)
  );
  const context = useAuth();
  const backendInteractor = new BackendInteractor(context.token);

  const { handleSubmit, getFieldProps, errors, touched } = useFormik({
    initialValues: {
      name: (user?.name as string) ?? "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("required").min(3),
    }),
    onSubmit: (values) => handleEditProfile(values),
  });

  const { mutate: handleEditProfile, isLoading } = useMutation(
    async (payload: any) => backendInteractor.editProfile(payload),
    {
      async onSuccess(data, payload) {
        window.alert("Success edit profile");
        user.name = payload.name;
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      },
      onError(err: any) {
        const data = err.response.data;
        window.alert(data.desc);
      },
    }
  );

  const {
    handleSubmit: handleSubmitPass,
    getFieldProps: getFieldPropsPass,
    errors: errorsPass,
    touched: touchedPass,
  } = useFormik({
    initialValues: {
      ...(user.pwSet && {
        currentPassword: "",
      }),
      newPassword: "",
      confirmPassword: "",
    } as {
      currentPassword?: string;
      newPassword: string;
      confirmPassword: string;
    },
    validationSchema: Yup.object({
      ...(user.pwSet && {
        currentPassword: Yup.string().required("required").min(8),
      }),
      newPassword: Yup.string().required("required").min(8),
      confirmPassword: Yup.string().required("required").min(8),
    }),
    onSubmit: (values) => {
      if (values.newPassword !== values.confirmPassword)
        window.alert("New Password And confirm Password are not the same");
      else {
        submitPass(values);
      }
    },
  });

  const { mutate: submitPass, isLoading: isLoadingPass } = useMutation(
    async (payload: any) =>
      user.pwSet
        ? backendInteractor.resetPassword(payload)
        : backendInteractor.setPassword(payload),
    {
      async onSuccess() {
        window.alert("Success reset password");
        if (!user.pwSet) {
          user.pwSet = true;
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
        }
      },
      onError(err: any) {
        const data = err.response.data;
        window.alert(data?.details?.reason ?? data.desc);
      },
    }
  );

  return (
    <div className="App">
      <div className="App-header">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            justifyItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={user?.profilePicture ?? DefaultPP}
            alt="pp"
            width="50"
            height="50"
            style={{ borderRadius: 50, padding: 10, alignSelf: "center" }}
          />
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 25,
            }}
          >
            <label>Name:</label>
            <input type="text" {...getFieldProps("name")} />
            {touched.name && errors.name ? (
              <p style={{ color: "red", fontSize: 16, padding: 0, margin: 0 }}>
                {errors.name}
              </p>
            ) : null}
            <button type="submit" style={{ margin: 5 }} disabled={isLoading}>
              {isLoading ? "Loading" : "Submit"}
            </button>
          </form>
          <div
            style={{
              alignSelf: "center",
              width: "120%",
              height: "30%",
              padding: 25,
              flexGrow: 1,
              textAlign: "center",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              borderRadius: 5,
            }}
          >
            <div>{user.pwSet ? "Reset Password" : "Set Password"}</div>
            <form
              onSubmit={handleSubmitPass}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {user.pwSet && (
                <>
                  <input
                    type="text"
                    placeholder="Current Password"
                    {...getFieldPropsPass("currentPassword")}
                    style={{ margin: 10 }}
                  />
                  {touchedPass.currentPassword && errorsPass.currentPassword ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 16,
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {errorsPass.currentPassword}
                    </p>
                  ) : null}
                </>
              )}
              <input
                type="password"
                placeholder={user.pwSet ? "New Password" : "Set Password"}
                {...getFieldPropsPass("newPassword")}
                style={{ margin: 10 }}
              />
              {touchedPass.newPassword && errorsPass.newPassword ? (
                <p
                  style={{ color: "red", fontSize: 16, padding: 0, margin: 0 }}
                >
                  {errorsPass.newPassword}
                </p>
              ) : null}
              <input
                type="password"
                placeholder="Confirm Password"
                {...getFieldPropsPass("confirmPassword")}
                style={{ margin: 10 }}
              />
              {touchedPass.confirmPassword && errorsPass.confirmPassword ? (
                <p
                  style={{ color: "red", fontSize: 16, padding: 0, margin: 0 }}
                >
                  {errorsPass.confirmPassword}
                </p>
              ) : null}
              <button
                type="submit"
                style={{ margin: 5 }}
                disabled={isLoadingPass}
              >
                {isLoadingPass ? "Loading" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
