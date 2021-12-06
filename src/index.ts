import esriConfig from '@arcgis/core/config';
import App from './app/App';
import { fetchService } from './services/FetchService';

esriConfig.assetsPath = './assets';

/**
 * Initialize application
 */
fetchService.fetchConfigurations().then(() => {
  /** set geometry service url */
  esriConfig.geometryServiceUrl = `${fetchService.getUrlOf('GeometryService')}`;

  /** set fonts url */
  esriConfig.fontsUrl = `${fetchService.getBaseURL()}assets/fonts`;

  /** set portal url */
  esriConfig.portalUrl = `${fetchService.getOrigin()}portal`;

  /**
   * All esri request interceptor
   */
  esriConfig.request.timeout = 180000;

  /** root app component */
  return new App({
    container: document.getElementById('app') as HTMLElement,
  });
});
