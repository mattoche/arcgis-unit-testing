import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import Accessor from '@arcgis/core/core/Accessor';
import * as watchUtils from '@arcgis/core/core/watchUtils';
import { logger, LogLevel } from './LoggerService';

@subclass('services.FetchService')
class FetchService extends Accessor {
  private readonly baseURL: string;
  private readonly origin: string;

  private readonly fileName = ['Connection.json', 'Basemaps.json'];

  private configURLs = new Map<string, any>();
  private webmapType: string;
  private baseURLToFetch: string;
  private devConfigPathname = 'config/dev/';
  private prodConfigPathname = 'config/';

  @property()
  initialized = false;

  constructor() {
    super();
    // extract webmap param from url
    this.baseURL = location.href.split('?')[0];
    this.origin = location.origin + '/';
    const paramWebmap = this.getParamOfApplication('webmap');
    this.webmapType = paramWebmap ? paramWebmap : 'compa';

    if (process.env.NODE_ENV === 'production') {
      this.baseURLToFetch = this.baseURL + this.prodConfigPathname;
    } else if (process.env.NODE_ENV === 'development') {
      this.baseURLToFetch = this.devConfigPathname;
    } else {
      throw new Error('Unknown environment mode : ' + process.env.NODE_ENV + ', cannot load configuration files');
    }

    const paramConfig = this.getParamOfApplication('config');
    if (paramConfig) {
      this.baseURLToFetch = this.baseURLToFetch + paramConfig + '/';
    }

    // FIXME services need to be initialized by another way. FetchService need to be the first service initialized and other access to it.
    if (logger && this.isOnDebugMode()) {
      logger.setLogLevel(LogLevel.DEBUG);
    }
  }

  isOnlyBasemapMode(): boolean {
    return this.getParamOfApplication('onlybasemap') === 'true';
  }

  isOnDebugMode(): boolean {
    return this.getParamOfApplication('debug') === 'true';
  }

  getParamOfApplication(param: string): any {
    return new URL(location.href).searchParams.get(param);
  }

  fetchConfigurations(): Promise<void> {
    return new Promise((resolve) => {
      Promise.all(this.fileName.map((name) => this.fetchConfiguration(name))).then(() => {
        this.initialized = true;
        resolve();
      });
    });
  }

  private async fetchConfiguration(fileName: string): Promise<any> {
    try {
      const result = await this.fetchGet(this.getBaseURLToFetch() + fileName, new Headers(), {
        cache: 'reload',
        redirect: 'manual',
      });

      return this.configURLs.set(fileName, result);
    } catch (error) {
      console.error('An error occurred while getting json files : ', error, fileName, this.getBaseURLToFetch());
      return false;
    }
  }

  waitForConfigurationLoaded(): Promise<void> {
    return new Promise((resolve) => watchUtils.whenTrueOnce(this, 'initialized', resolve));
  }

  getConfigOfFile(fileName: string): any {
    return this.configURLs.get(fileName);
  }

  getUrlOf(endpointName: string): string {
    const url: string = this.getConfigOfFile('Connection.json')[endpointName];
    if (url.includes('<webmap>')) {
      if (this.webmapType === 'default') {
        return this.getConfigOfFile('Connection.default.json')[endpointName];
      } else {
        return url.replace('<webmap>', this.webmapType);
      }
    }
    return url;
  }

  /**
   *
   * @param endpointName
   * @param options
   */
  async fetchGetUrlOf(endpointName: string, options?: { cache?: string; mode?: string }): Promise<Response> {
    const url = this.getUrlOf(endpointName);
    return await this.fetchGet(url, new Headers(), options);
  }

  /**
   *
   * @param url
   * @param headers
   * @param options
   */
  async fetchGet(
    url: string,
    headers: Headers,
    options?: { cache?: string; mode?: string; redirect?: string },
  ): Promise<any> {
    const response = await this.fetchWithSameOrigin(url, {
      method: 'GET',
      headers,
      ...(options && { ...options }),
    });

    return await this.handleFetchResponse(response);
  }

  /**
   *
   * @param url
   * @param headers
   * @param body
   * @param options
   */
  async fetchPost(
    url: string,
    headers: Headers,
    body: any,
    options?: { cache?: string; mode?: string; redirect?: string },
  ): Promise<any> {
    const response = await this.fetchWithSameOrigin(url, {
      method: 'POST',
      headers,
      ...(options && { ...options }),
      body: JSON.stringify(body),
    });

    return await this.handleFetchResponse(response);
  }

  fetchWithSameOrigin(url: any, query: any) {
    query.credentials = 'same-origin';
    return fetch(url, query);
  }

  getBaseURL() {
    return this.baseURL;
  }

  getBaseURLToFetch() {
    return this.baseURLToFetch;
  }

  getOrigin() {
    return this.origin;
  }

  /**
   * Traitement de toutes les réponses http des appels rest non carto
   *
   * @param response
   */
  private async handleFetchResponse(response: any) {
    /**
     * response.type === 'opaqueredirect' is from redirect manual
     */
    if (response.redirected || response.type === 'opaqueredirect') {
      this.logout();
    }

    if (response.status) {
      if (response.status === 401) {
        this.logout();
      } else if (response.status !== 200) {
        // traitement d'autre code d'erreur
        throw new Error(JSON.stringify(response));
      }
    }

    return await response.json();
  }

  private logout() {
    try {
      const logoutUrl = fetchService.getUrlOf('ApplicationExit');
      if (logoutUrl) {
        window.location.href = logoutUrl;
      } else {
        throw new Error('Logout URL not loaded !!!');
      }
    } catch (error) {
      document.location.reload();
    }
  }
}

export const fetchService = new FetchService();
