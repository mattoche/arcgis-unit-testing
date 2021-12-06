import esri = __esri;

declare namespace __app {
  export interface AppViewModelProperties extends Object {
    /**
     * Esri map or scene view.
     */
    view?: esri.MapView | esri.SceneView;
  }

  export class AppViewModel extends esri.Accessor {
    view: esri.MapView | esri.SceneView;
  }

  export interface AppProperties extends esri.WidgetProperties {
    /**
     * App view model.
     */
    viewModel?: AppViewModel;

    /**
     * Esri map or scene view.
     */
    view: esri.MapView | esri.SceneView;

    /**
     * Title to display in header.
     */
    title?: string;

    /**
     * Esri search view model for search widget.
     */
    searchViewModel?: esri.SearchViewModel;
  }

  export class App extends esri.Widget {
    constructor(properties: AppProperties);
    viewModel: AppViewModel;
    view: esri.MapView | esri.SceneView;
    title: string;
    searchViewModel: esri.SearchViewModel;
  }
}

declare module 'app/App' {
  import App = __app.App;
  export = App;
}

declare module 'app/App/AppViewModel' {
  import AppViewModel = __app.AppViewModel;
  export = AppViewModel;
}

// FIXME : createSubclass a été utilisé pour la migration ArcgisJS 4.15 → 4.19
//  mais cette fonction createSubclass n'est pas clairement visible dans la doc
//  d'Arcgis, c'est plus un contournement proposé par le support d'Arcgis pour
//  étendre les classes de la lib.
//  À l'avenir, il sera peut être possible de créer des classes filles avec un
//  simple extends dans le futur, mais l'utilisation de extends sur des classe
//  d'Arcgis a été cassé en 4.16
declare module '@arcgis/core/Graphic' {
  import Graphic from '@arcgis/core/Graphic';
  export default Graphic;
  export function createSubclass(param: { constructor(props: __esri.GraphicProperties): Graphic });
}
declare module '@arcgis/core/layers/GraphicsLayer' {
  import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
  export default GraphicsLayer;
  export function createSubclass(param: { constructor(props: __esri.GraphicsLayerProperties): GraphicsLayer });
}
declare module '@arcgis/core/layers/FeatureLayer' {
  import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
  export default FeatureLayer;
  export function createSubclass(param: { constructor(props: __esri.FeatureLayerProperties): FeatureLayer });
}
declare module '@arcgis/core/geometry/Extent' {
  import Extent from '@arcgis/core/geometry/Extent';
  export default Extent;
  export function createSubclass(param: { constructor(props: __esri.ExtentProperties): Extent });
}
