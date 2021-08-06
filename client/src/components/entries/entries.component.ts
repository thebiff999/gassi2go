/* Autor: Dennis Heuermann */

import { customElement, html, LitElement, css, unsafeCSS, internalProperty } from 'lit-element';
import { router } from '../../router';
import { repeat } from 'lit-html/directives/repeat';
import { httpClient } from '../../http-client';
import { PageMixin } from '../page.mixin';
import { Loader } from '@googlemaps/js-api-loader';
import {} from 'google.maps';
import { Modal } from 'bootstrap';
import { Entry } from '../../../../api-server/src/models/entry';
import Cookies from 'js-cookie';
import { getDistance } from '../../distance';

const entriesComponentCSS = require('./entries.component.scss');

interface Coords {
  lat: number;
  lng: number;
}

@customElement('app-entries')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class EntriesComponent extends PageMixin(LitElement) {
  static styles = [
    css`
      ${unsafeCSS(entriesComponentCSS)}
    `
  ];

  @internalProperty()
  private entries: Entry[] = [];

  @internalProperty()
  private location: Coords = { lat: 0, lng: 0 };

  @internalProperty()
  private modal: Modal | undefined;

  @internalProperty()
  private map: google.maps.Map | undefined;

  @internalProperty()
  private openWindow: google.maps.InfoWindow | undefined;

  render() {
    return html`
        ${this.renderNotification()}
        <div id="locationModal" class="modal blurred" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Standort Freigabe</h5>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p id="modal-text">Damit Gassi2Go dir Fellnasen in der Nähe anzeigen kann, benötigen wir deinen Standort.</p>
                    </div>
                    <div class="modal-footer">
                        <button id="modal-button" type="button"  class="btn btn-primary" @click="${
                          this.askforLocation
                        }">
                            <div id="modal-spinner" class="visually-hidden">
                                <div  class="spinner-border spinner-border-sm" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <span>Laden...</span>
                            </div>                            
                            <span id="modal-text2">Standort freigeben</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div>
            <button id="toggle-btn" class="btn btn-success toggle-btn" @click="${this.toggleButton}">
                Zur Kartenansicht
            </button>
        </div>

        <div id="entries" class="container-fluid">
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3 g-xxl-5">
                ${repeat(
                  this.entries,
                  entry => entry.id,
                  entry =>
                    html`
                      <div class="col">
                        <div class="card shadow entry">
                          <div class="card-body">
                            <img class="card-img-top" src="data:image/jpeg;base64,${entry.imgData}" />
                            <p class="name">Name: ${entry.dogName}</p>
                            <p class="distance">
                              Entfernung: ${getDistance(entry.lat, entry.lng, this.location.lat, this.location.lng)} km
                            </p>
                            ${this.renderButton(entry.type, entry.id)}
                          </div>
                        </div>
                      </div>
                    `
                )}
            </div>
        </div>
        <div id="map-container" class="visually-hidden">
            <div id="map">
            </div>
        </div>
        `;
  }

  renderButton(type: string, id: string) {
    let content;
    if (type == 'walk') {
      content = html`<button @click=${() =>
        this.showDetails(id)} class="btn btn-primary">Führ mich aus <i class="fas fa-paw"></i></a>`;
    } else {
      content = html`<button @click=${() =>
        this.showDetails(id)} class="btn btn-primary">Pass auf mich auf <i class="fas fa-bone"></i></a>`;
    }
    return content;
  }

  //helper function to toggle the visibility status of elements
  toggleView(id: string) {
    const element = this.shadowRoot?.querySelector(id);
    element?.classList.toggle('visually-hidden');
  }

  //toggles between card and map view
  toggleButton = () => {
    const button = this.shadowRoot?.querySelector('#toggle-btn') as HTMLElement;
    if (button!.innerText == 'Zur Kartenansicht') {
      button!.innerText = 'Zur Kachelansicht';
    } else {
      button!.innerText = 'Zur Kartenansicht';
    }
    document.querySelector('app-root')?.shadowRoot?.querySelector('app-footer')?.toggleAttribute('hidden');
    this.toggleView('#entries');
    this.toggleView('#map-container');
  };

  //creates a Google Map on the #map div
  createMap() {
    //Create Google Map
    if (!window.google) {
      const loader = new Loader({
        apiKey: 'xyz123',
        version: 'weekly'
      });
      loader
        .load()
        .then(() => {
          this.map = new google.maps.Map(this.shadowRoot?.querySelector('#map') as HTMLElement, {
            center: this.location,
            zoom: 13,
            disableDefaultUI: true
          });
        })
        .then(() => {
          for (let i = 0; i < this.entries.length; i++) {
            this.addMarker(this.entries[i]);
          }
        });
    } else {
      this.map = new google.maps.Map(this.shadowRoot?.querySelector('#map') as HTMLElement, {
        center: this.location,
        zoom: 13,
        disableDefaultUI: true
      });
      for (let i = 0; i < this.entries.length; i++) {
        this.addMarker(this.entries[i]);
      }
    }
  }

  //called after render has been called for the first time. Opens the modal dialog
  async firstUpdated() {
    //check if the user location is saved in a cookie
    const cookies = Cookies.get();
    if (cookies.lat) {
      this.location.lat = parseFloat(cookies.lat);
      this.location.lng = parseFloat(cookies.lng);
    }
    //call modal for User Location
    else {
      const modal = this.shadowRoot?.querySelector('#locationModal') as HTMLElement;
      this.modal = new Modal(modal, { backdrop: 'static', keyboard: false });
      this.modal.show();
    }

    //request entries from api-server
    try {
      const response = await httpClient.get('/entries');
      this.entries = (await response.json()).results;
    } catch ({ message, statusCode }) {
      switch (statusCode) {
        case 401:
          router.navigate('/user/sign-in');
          break;
        case 404:
          this.setNotification({ infoMessage: 'Aktuell sind keine offenene Aufträge vorhanden' });
          break;
        default:
          this.setNotification({ errorMessage: message });
      }
    }

    //create the map after the entries have been loaded
    this.createMap();
    this.requestUpdate();
  }

  //asks the user for location permission
  askforLocation() {
    document.getElementById('modal-spinner')?.classList.toggle('visually-hidden');
    document.getElementById('modal-text2')?.classList.toggle('visually-hidden');
    navigator.geolocation.getCurrentPosition(
      pos => {
        this.location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.modal?.hide();
        Cookies.set('lat', this.location.lat.toString(), { expires: 7 });
        Cookies.set('lng', this.location.lng.toString(), { expires: 7 });
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      error => {
        alert('Standort wurde nicht freigegeben');
        document.getElementById('modal-spinner')?.classList.toggle('visually-hidden');
        document.getElementById('modal-text2')?.classList.toggle('visually-hidden');
      }
    );
  }

  //adds markers on the map for the entries
  addMarker(entry: Entry) {
    // create the markers
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    const map = this.map;
    const lat = parseFloat(entry.lat);
    const lng = parseFloat(entry.lng);
    const markerPosition = { lat, lng };
    const marker = new google.maps.Marker({
      position: markerPosition,
      map: map
    });
    //create the info windows
    const infoWindow = new google.maps.InfoWindow({
      content: `
            <div style="float:left">
                <img src="data:image/jpeg;base64,${entry.imgData}" width="200px" height="150px">
            </div>
            <div style="float:right; padding: 10px;">
                <h5>${entry.dogName}</h5>
                <p>Entfernung: ${getDistance(entry.lat, entry.lng, this.location.lat, this.location.lng)} km</p>
                <p>Datum: ${entry.date}</p>
                <p>Bezahlung: ${entry.pay}€</p>
            </div>`
    });
    //link markers and info windows
    marker.addListener('click', function () {
      _this.closeOpenedWindow();
      infoWindow.open(map, marker);
      _this.saveOpenedWindow(infoWindow);
    });
  }

  //saves the opened window to a the internal property 'openWindow'
  saveOpenedWindow(window: google.maps.InfoWindow) {
    this.openWindow = window;
  }

  //closes the open window saved in the internal property 'openWindow'
  closeOpenedWindow() {
    this.openWindow?.close();
  }

  //navigates to the detailed view of an entry, realized by the entry-details-component
  showDetails(entryId: string) {
    router.navigate(`/entries/${entryId}`);
  }

  //renders the html-content to output depending on the entry type (walk / care)
  renderType(entry: Entry) {
    let content;
    if (entry.type == 'walk') {
      content = html`<p>Auftragsart: Gassi</p>`;
    } else {
      content = html`<p>Auftragsart: Aufpassen</p>`;
    }
    return content;
  }
}
