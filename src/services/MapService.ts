/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { subclass, property } from '@arcgis/core/core/accessorSupport/decorators';
import Accessor from '@arcgis/core/core/Accessor';
import Basemap from '@arcgis/core/Basemap';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Point from '@arcgis/core/geometry/Point';
import TileLayer from '@arcgis/core/layers/TileLayer';
import Layer from '@arcgis/core/layers/Layer';
import Collection from '@arcgis/core/core/Collection';
import { fetchService } from './FetchService';
import { logger } from './LoggerService';

@subclass('services.MapService')
class MapService extends Accessor {
  @property()
  private mapView: MapView;

  getMapView(): MapView {
    if (!this.mapView) {
      throw new Error("MapView isn't initialized yet");
    }
    return this.mapView;
  }

  createMapView(container: string | HTMLDivElement): MapView {
    try {
      const basemapsConfig = fetchService.getConfigOfFile('Basemaps.json');
      this.mapView = new MapView({
        map: this.createMap(basemapsConfig),
        center: this.getMapCenter(basemapsConfig),
        zoom: basemapsConfig.defaultMapPosition.zoomFactor,
        container,
        ui: {
          components: [],
        },
        constraints: {
          rotationEnabled: false,
        },
      });

      this.mapView.watch('fatalError', (error) => {
        if (error) {
          console.error(error);
          console.error('Fatal Error! View has lost its WebGL context. Attempting to recover...');
          this.mapView.tryFatalErrorRecovery();
        }
      });

      return this.mapView;
    } catch (e) {
      logger.errorAndThrow('An error occured while mapView intialized : ' + e);
      return this.mapView;
    }
  }

  private createMap(basemapsConfig: any): Map {
    const defaultTileLayer = basemapsConfig.tileLayers.find(
      (layer: any) => layer.id === basemapsConfig.defaultTileLayerId,
    );
    return new Map({
      basemap: this.createBaseMap(defaultTileLayer),
    });
  }

  private getMapCenter(basemapsConfig: any) {
    return new Point({
      x: basemapsConfig.defaultMapPosition.mapCenterX,
      y: basemapsConfig.defaultMapPosition.mapCenterY,
      spatialReference: { wkid: this.getSpatialReference() },
    });
  }

  private getBackground(url: string): TileLayer {
    return new TileLayer({ url: url });
  }

  addLayersToView(layers: Layer[]): void {
    this.mapView.map.addMany(layers.reverse());
  }

  addLayerToView(layer: Layer): void {
    this.mapView.map.add(layer);
  }

  addLayerUnderOperationals(layer: Layer): void {
    this.mapView.map.layers.add(layer, 0);
  }

  removeLayerToViewById(layerId: any): void {
    let layer: Layer | null = this.mapView.map.findLayerById(layerId);
    try {
      layer.cancelLoad();
    } catch (e) {}
    this.mapView.map.remove(this.mapView.map.findLayerById(layerId));
    layer = null;
  }

  getLayers(): Collection<Layer> {
    return this.mapView.map.layers;
  }

  reloadLayerAfterChange(layer: Layer) {
    this.removeLayerToViewById(layer.id);
    this.addLayerUnderOperationals(layer);
  }

  setLayerOpacity(opacityValue: number, targetedLayer: Layer) {
    this.getLayers().find((layer) => layer === targetedLayer).opacity = opacityValue;
  }

  getLayerOpacity(targetedLayer: Layer): number {
    return this.getLayers().find((layer) => layer === targetedLayer).opacity;
  }

  createBaseMap(tileLayer: any): Basemap {
    return new Basemap({
      baseLayers: [this.getBackground(tileLayer.url)],
      thumbnailUrl: tileLayer.thumbnailUrl,
      title: tileLayer.title,
      id: tileLayer.id,
    });
  }

  getSpatialReference() {
    // FIXME need to store value, instead of search value in json at each calls
    return fetchService.getConfigOfFile('Basemaps.json').defaultMapPosition.spatialReference;
  }
}

export const mapService = new MapService();
