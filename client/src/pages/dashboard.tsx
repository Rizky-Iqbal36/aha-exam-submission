import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import BackendInteractor from "../app/api";
import { useAuth } from "../app/context/AuthProvider";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export type Await<T> = T extends PromiseLike<infer U> ? U : T;
const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") ?? "false");
  const isEmailVerified = user?.isEmailVerified;

  const context = useAuth();
  const backendInteractor = new BackendInteractor(context.token);

  const [users, setUsers] = useState<
    Await<ReturnType<typeof backendInteractor.users>>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backendInteractor.users().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        {isEmailVerified ? (
          loading ? (
            <div>LOADING ...</div>
          ) : (
            <div style={{ height: 400, width: "80%" }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Email</StyledTableCell>
                      <StyledTableCell align="center">Name</StyledTableCell>
                      <StyledTableCell align="center">
                        Total Login
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Last Session Date
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Email Verification Date
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Registration Date
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users?.map(
                      ({
                        id,
                        email,
                        name,
                        totalLogin,
                        lastSessionDate,
                        emailVerificationDate,
                        registrationDate,
                      }) => {
                        return (
                          <StyledTableRow key={id}>
                            <StyledTableCell component="th" scope="row">
                              {email}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {name}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {totalLogin}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {lastSessionDate}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {emailVerificationDate}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {registrationDate}
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )
        ) : (
          "You are not allowed to access this page, your email is not verified, click here to Resend Email Verification"
        )}
      </div>
    </div>
  );
};
export default Dashboard;
