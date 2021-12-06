import { fetchService } from './FetchService';
import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';
import Accessor from '@arcgis/core/core/Accessor';

@subclass('services.WebmapBaseService')
class WebmapBaseService extends Accessor {
  @property()
  webmapBaseJson: any;

  async init() {
    try {
      this.webmapBaseJson = await fetchService.fetchGetUrlOf('OperationalLayers');
      return;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  findLayerInWebmap(url: string): any {
    if (this.webmapBaseJson) {
      const findUrl = (layerJson: any) => layerJson.url.includes(url);
      return this.webmapBaseJson.itemData.operationalLayers.find(findUrl);
    }
    return null;
  }

  findTableInWebmap(url: string): any {
    if (this.webmapBaseJson) {
      const findUrl = (layerJson: any) => layerJson.url.includes(url);
      return this.webmapBaseJson.itemData.tables?.find(findUrl);
    }
    return null;
  }
}

export const webmapBaseService = new WebmapBaseService();
