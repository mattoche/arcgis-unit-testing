import { tsx } from '@arcgis/core/widgets/support/widget';
import { version } from '../../package.json';

const CSS = {
  base: 'app-header',
  container: 'app-header-container',

  leftItem: 'app-header-left',
  centerItem: 'app-header-center',
  rightItem: 'app-header-right',

  logo: 'app-header-logo',
  title: 'app-header-title',
  matricule: 'app-header-matricule',

  btn: 'button esri-widget--button',
  btnTableMoyen: 'button esri-widget--button button esri-icon-table',
  btnRefresh: 'button esri-widget--button esri-icon-refresh',

  toggle: {
    container: 'app-toggle-container',
    toggle: 'app-toggle',
    toggleVertical: 'app-toggle-vertical',
    firstLabel: 'app-toggle-first-label',
    secondLabel: 'app-toggle-second-label',
    firstInput: 'app-toggle-first-input',
    secondInput: 'app-toggle-second-input',
    ousideBox: 'app-toggle-outside',
    insideBox: 'app-toggle-inside',
  },

  editionPanModeContainerId: 'edition-pan-mode-container-id',
  btnEditionPanMode: 'edition-pan-mode-btn',
  iconCheck: 'esri-icon-checkbox-checked',
  iconUncheck: 'esri-icon-checkbox-unchecked',
  selectModeContainer: 'select-mode-container',
  select: 'esri-select',

  refreshMapId: 'refreshMapId',
  modeSelectId: 'selectId',
  searchContainerId: 'searchWidget',
  clockContainerId: 'clockWidget',
  wsMessageId: 'wsMessage',
  webgldWarnId: 'webglWarn',
};

const goToWebglSupport = () => {
  window.open(`${window.location.href}/webgl-support.html`);
};

interface HeaderProperties {
  appName: string;
  registerNumber: string;
}

export const Header = (props: HeaderProperties): tsx.JSX.Element => (
  <header class={CSS.base}>
    <div class={CSS.container}>
      <div class={CSS.leftItem}>
        <div class={CSS.logo}>
          <div class={CSS.title}>
            <div>{props.appName}</div> <div style="font-size:9px;">{version}</div>
          </div>
        </div>
      </div>

      <div class={CSS.centerItem}>
        <div id={CSS.searchContainerId} />
      </div>

      <div class={CSS.rightItem}>
        <div id={CSS.webgldWarnId}>
          <a
            onclick={goToWebglSupport}
            target="_blank"
            class="esri-icon-notice-round"
            data-title-tooltip="Problème de WebGL Graphics Acceleration détecté. Cliquez pour resoudre le problème."
          />
        </div>

        <div id={CSS.wsMessageId} />

        <div id={CSS.clockContainerId} />
      </div>
    </div>
  </header>
);
