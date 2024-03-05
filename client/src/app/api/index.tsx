import axios, { AxiosInstance } from "axios";
import appConfig from "../config";

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

  public async login(payload: { email: string; password: string }) {
    return this.client
      .post("/auth/login", payload, {
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
}

export default BackendInteractor;
