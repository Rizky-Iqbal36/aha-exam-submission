import axios, { AxiosInstance } from 'axios';
import qs from 'qs';
import { InternalServerError } from '../exception';
import { googleConfig } from '../config';
import { EFlag } from '@root/src/interfaces/enum';

class GoogleOAuth {
  private readonly oAuthClient: AxiosInstance;

  private readonly googleAPIClient: AxiosInstance;

  constructor() {
    this.oAuthClient = axios.create({ baseURL: 'https://oauth2.googleapis.com' });
    this.googleAPIClient = axios.create({ baseURL: 'https://www.googleapis.com' });
  }

  public async getOAuthToken(code: string) {
    return this.oAuthClient
      .post(
        '/token',
        qs.stringify({
          code,
          client_id: googleConfig.oauthClientId,
          client_secret: googleConfig.oauthClientSecret,
          redirect_uri: googleConfig.oauthClientRedirectURI,
          grant_type: 'authorization_code',
        }),
        {
          headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((res) => res.data)
      .catch((err) => {
        const error = err.response.data;
        throw new InternalServerError({ flag: EFlag.ERROR_OCCURED, ...error });
      });
  }

  public async getGoogleUser(
    idToken: string,
    access_token: string
  ): Promise<{
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    picture: string;
  }> {
    return this.googleAPIClient
      .get('/oauth2/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        params: {
          alt: 'json',
          access_token,
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        const error = err.response.data;
        throw new InternalServerError({ flag: EFlag.ERROR_OCCURED, ...error });
      });
  }
}

export default new GoogleOAuth();
