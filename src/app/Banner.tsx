import { tsx } from '@arcgis/core/widgets/support/widget';
import * as watchUtils from '@arcgis/core/core/watchUtils';
import { fetchService } from '../services/FetchService';
import { mapService } from '../services/MapService';

class Banner {
  private showLoader = true;
  private messages: any[] = [];

  private title = '';

  private registerNumber?: string;

  constructor() {
    this.showLoader = true;
    fetchService.waitForConfigurationLoaded().then(() => this.loadMessagesFromConfig());
  }

  private loadMessagesFromConfig() {
    this.messages = ['Loading'];
  }

  render(): tsx.JSX.Element {
    return (
      <div id="bannerModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{this.title}</h2>
            <h6>{this.registerNumber}</h6>
          </div>
          <div class="modal-body">
            {this.generateMessages()}
            {this.generateLoader()}
          </div>
        </div>
      </div>
    );
  }

  private generateLoader() {
    return this.showLoader ? <div id="loader" /> : null;
  }

  private generateMessages() {
    return this.messages.map((message, index) => <p key={index}>{message}</p>);
  }

  showBanner() {
    const container: HTMLElement | null = this.getContainerElt();
    if (container) {
      container.style.display = 'block';
    }
    this.showLoader = true;
  }

  showError(errorMessage: any, otherMessages?: any[]) {
    const container: HTMLElement | null = this.getContainerElt();
    if (container) {
      container.style.display = 'block';
    }
    this.messages = [errorMessage];
    if (otherMessages) {
      this.messages = this.messages.concat(otherMessages);
    }
    this.showLoader = false;
  }

  hideBanner() {
    const container: HTMLElement | null = this.getContainerElt();
    if (container) {
      container.style.display = 'none';
    }
  }

  closeBannerWhenViewIsLoaded() {
    watchUtils.whenFalseOnce(mapService.getMapView(), 'updating', () => {
      this.hideBanner();
    });
    //TODO temporary solution to replace with a better managing of the banner
    setTimeout(() => {
      this.hideBanner();
    }, 10000);
  }

  setRegisterNumber(registerNumber: string) {
    this.registerNumber = registerNumber;
  }

  private getContainerElt(): HTMLElement | null {
    return document.getElementById('bannerModal');
  }
}

export const banner = new Banner();
