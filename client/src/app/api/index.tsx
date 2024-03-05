import axios, { AxiosInstance } from "axios";
import appConfig from "../config";
import { TAuthPayload } from "../../interfaces";

class BackendInteractor {
  private client: AxiosInstance;

  constructor(public accessToken?: string) {
    this.client = axios.create({
      baseURL: appConfig.apis.backendURI,
      ...(accessToken && {
        headers: {
          ["Authorization"]: `Bearer ${accessToken}`,
        },
      }),
    });
  }

  public async auth(mode: "register" | "login", payload: TAuthPayload) {
    return this.client
      .post(`/auth/${mode}`, payload, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((res) => res.data);
  }

  public async profile() {
    return this.client.get("/user/profile").then((res) => res.data);
  }

  public async users(): Promise<
    {
      id: number;
      profilePicture: string;
      email: string;
      name: string;
      totalLogin: number;
      lastSessionDate: string;
      emailVerificationDate: string;
      registrationDate: string;
    }[]
  > {
    return this.client.get("/user/list").then((res) => res.data.data);
  }

  public async resendVerification() {
    return this.client
      .get("/email/resend-verification")
      .then((res) => res.data);
  }
}

export default BackendInteractor;
