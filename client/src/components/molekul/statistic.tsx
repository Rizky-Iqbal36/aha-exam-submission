import React, { useEffect, useState } from "react";
import BackendInteractor from "../../app/api";
import { useAuth } from "../../app/context/AuthProvider";

const itemStyle: React.CSSProperties = {
  padding: "1rem 1rem",
  margin: 10,
  width: "80%",
  height: "30%",
  flexGrow: 1,
  textAlign: "center",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  borderRadius: 5,
};
const fontDivStyle: React.CSSProperties = { margin: 10 };

const Statistic = () => {
  const context = useAuth();
  const backendInteractor = new BackendInteractor(context.token);
  const [statistic, setStatistic] = useState<{
    totalUser: number;
    userActiveToday: number;
    avrgActiveUser: number;
  }>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    backendInteractor.usersStatistic().then((data) => {
      setStatistic(data);
      setLoading(false);
    });
  }, []);
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: "flex", width: "80%" }}>
          <div style={itemStyle}>
            <h6 style={fontDivStyle}>Signed Up user:</h6>
            <p style={fontDivStyle}>{statistic?.totalUser}</p>
          </div>
          <div style={itemStyle}>
            <h6 style={fontDivStyle}>User active today:</h6>
            <p style={fontDivStyle}>{statistic?.userActiveToday}</p>
          </div>
          <div style={itemStyle}>
            <h6 style={fontDivStyle}>Avrg active user last 7 days:</h6>
            <p style={fontDivStyle}>{statistic?.avrgActiveUser}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Statistic;
