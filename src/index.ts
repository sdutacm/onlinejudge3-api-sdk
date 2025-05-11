import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Cookie, CookieJar } from 'tough-cookie';
import cryptoRandomString from 'crypto-random-string';
import { OnlineJudge3ApiModuleIndex } from './gen/index';
import { ApiException, HttpException } from './exception';
import { routesBe } from './common/routes/be.route';

export interface OnlineJudge3ApiClientOptions {
  apiUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
  apiKey?: string;
  systemAuth?: string;
  cookie?: string;
}

export interface OnlineJudge3ApiRequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

export default class OnlineJudge3ApiClient extends OnlineJudge3ApiModuleIndex<OnlineJudge3ApiRequestOptions> {
  private options: OnlineJudge3ApiClientOptions;
  private requestInstance: AxiosInstance;
  private apiOrigin: string;
  private cookieJar: CookieJar;

  constructor(options: OnlineJudge3ApiClientOptions = {}) {
    super();
    this.options = {
      apiUrl: options.apiUrl || 'https://oj.sdutacm.cn/onlinejudge3/api',
      timeout: options.timeout || 30000,
      headers: options.headers,
      apiKey: options.apiKey,
      systemAuth: options.systemAuth,
      cookie: options.cookie,
    };
    this.apiOrigin = new URL(this.options.apiUrl!).origin;

    this.cookieJar = new CookieJar();
    if (this.options.cookie) {
      const cookies = this.options.cookie.split(';').map((v) => Cookie.parse(v));
      if (!cookies.find((c) => c?.key === 'csrfToken')) {
        cookies.push(
          Cookie.parse(`csrfToken=${cryptoRandomString({ length: 24, type: 'alphanumeric' })}`),
        );
      }
      cookies.forEach((c) => {
        this.cookieJar.setCookieSync(c!, this.apiOrigin);
      });
    }

    this.requestInstance = Axios.create({
      baseURL: this.options.apiUrl,
      timeout: this.options.timeout,
      headers: JSON.parse(
        JSON.stringify({
          ...this.options.headers,
          'User-Agent': 'OnlineJudge3ApiClientSDK/1.0',
          'x-system-request-auth': this.options.systemAuth,
        }),
      ),
      validateStatus: (status) => {
        return status >= 200 && status < 500;
      },
    });
    this.requestInstance.interceptors.request.use((config) => {
      if (!config.headers) {
        config.headers = {};
      }
      const cookieString = this.cookieJar.getCookieStringSync(this.apiOrigin);
      cookieString && (config.headers.Cookie = cookieString);
      const csrfToken = this.cookieJar
        .getCookiesSync(this.apiOrigin)
        .find((c) => c.key === 'csrfToken')?.value;
      csrfToken && (config.headers['x-csrf-token'] = csrfToken);
      return config;
    });
    this.requestInstance.interceptors.response.use(
      (response) => {
        if (!response || !response.status) {
          throw new Error('Invalid response');
        }

        if (response.headers['set-cookie']) {
          const cookies = Array.isArray(response.headers['set-cookie'])
            ? response.headers['set-cookie']
            : [response.headers['set-cookie']];
          for (const cookie of cookies) {
            const parsedCookie = Cookie.parse(cookie.split(';')[0]);
            parsedCookie && this.cookieJar.setCookieSync(parsedCookie, this.apiOrigin);
          }
        }

        if (!response.data || typeof response.data !== 'object' || !('success' in response.data)) {
          const e = new HttpException(response.status, response.statusText, response.data);
          throw e;
        }

        if (!response.data.success) {
          const e = new ApiException(response.data.code, response.data.msg, response.data.data);
          throw e;
        }

        return response.data.data;
      },
      (error) => {
        throw error;
      },
    );

    super.init(this.request.bind(this));
  }

  request(apiName: string, req?: any, options: OnlineJudge3ApiRequestOptions = {}): Promise<any> {
    const api = routesBe[apiName];
    if (!api) {
      throw new Error(`API ${apiName} not found`);
    }
    const { method, url } = api;
    const reqOptions: AxiosRequestConfig = {
      method,
      url,
      data: req,
    };
    if (options.headers) {
      // @ts-ignore
      reqOptions.headers = {
        ...this.requestInstance.defaults.headers,
        ...options.headers,
      };
    }
    if ('timeout' in options) {
      reqOptions.timeout = options.timeout;
    }
    return this.requestInstance(reqOptions);
  }

  getCookieString() {
    return this.cookieJar.getCookieStringSync(this.apiOrigin);
  }
}

export * from './gen/index';
export * from './exception';
export * from './common/routes/index';
export * from './common/codes/index';
export * from './common/enums/index';
export * from './common/interfaces/index';
