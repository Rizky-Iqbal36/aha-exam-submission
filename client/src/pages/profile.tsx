import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";

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

  return (
    <div className="App">
      <div className="App-header">
        <div style={{ textAlign: "center", justifyContent: "center" }}>
          <img
            src={user.profilePicture}
            alt="pp"
            width="50"
            height="50"
            style={{ borderRadius: 25 }}
          />
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
        </div>
      </div>
    </div>
  );
};
export default Profile;
