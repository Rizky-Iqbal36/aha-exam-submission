import axios, { AxiosInstance } from "axios";
import appConfig from "../config";

class BackendInteractor {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: appConfig.apis.backendURI,
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
}

export default new BackendInteractor();
