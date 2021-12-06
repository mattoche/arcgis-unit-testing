import { subclass } from '@arcgis/core/core/accessorSupport/decorators';
import { tsx } from '@arcgis/core/widgets/support/widget';
import Widget from '@arcgis/core/widgets/Widget';
import { Header } from './Header';
import { banner } from './Banner';
import { mapService } from '../services/MapService';
import { webmapBaseService } from '../services/WebMapBaseService';

const CSS = {
  container: 'app-container',
  content: 'app-content',
  map: 'app-map',
  sidebar: 'app-sidebar',
};

@subclass('widgets.App')
export default class App extends Widget {
  private appName = 'UNIT TESTING';
  private registerNumber: string;
  private view: __esri.MapView;

  render(): tsx.JSX.Element {
    return (
      <div id={CSS.container}>
        {Header({
          appName: this.appName,
          registerNumber: this.registerNumber,
        })}
        {banner.render()}
        <div id={CSS.content}>
          <div id={CSS.map} bind={this} afterCreate={this.onAfterCreate} />
          <div id={CSS.sidebar} />
        </div>
      </div>
    );
  }

  private onAfterCreate(element: HTMLDivElement) {
    this.loadApplication(element);
  }

  private async loadApplication(element: HTMLDivElement) {
    try {
      banner.showBanner();
      this.view = mapService.createMapView(element);
      this.view
        .when(async () => {
          //ordre des appels importants : webmapAddService dépend de webmapBaseService
          await this.initWebmapBaseService();

          banner.hideBanner();
        })
        .catch((e) => {
          throw e;
        });
    } catch (e) {
      banner.showError("Erreur lors du chargement de l'application", [e]);
    }
  }

  private async initWebmapBaseService(): Promise<any> {
    try {
      await webmapBaseService.init();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
