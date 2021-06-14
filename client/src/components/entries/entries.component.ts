/* Autor: Dennis Heuermann */

import { customElement, html, LitElement, css, unsafeCSS, internalProperty } from "lit-element";
import { router } from '../../router';
import { repeat } from 'lit-html/directives/repeat';
import { httpClient } from '../../http-client';
import { PageMixin } from "../page.mixin";
import { Loader } from "@googlemaps/js-api-loader";
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
class EntriesComponent extends PageMixin(LitElement) {

    static styles = [
        css`${unsafeCSS(entriesComponentCSS)}`
    ]

    @internalProperty()
    private entries: Entry[] = [];

    @internalProperty()
    private location: Coords = {lat:0, lng:0};

    @internalProperty()
    private modal: Modal | undefined;

    @internalProperty()
    private map: google.maps.Map | undefined;

    @internalProperty()
    private openWindow: google.maps.InfoWindow | undefined;

    render() {

        return html`
        
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
                        <button type="button"  class="btn btn-primary" @click="${this.askforLocation}">
                            <div id="modal-spinner" class="visually-hidden">
                                <div  class="spinner-border spinner-border-sm" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <span>Laden...</span>
                            </div>                            
                            <span id="modal-button">Standort freigeben</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div>
            <button id="toggle-btn" class="btn btn-success toggle-btn" @click=${this.toggleButton}>
                Zur Kartenansicht
            </button>
        </div>

        <div id="entries" class="container-fluid">
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3 g-xxl-5">
                ${repeat(this.entries, entry => entry.id, entry =>
                html`
                <div class="col">
                    <div class="card shadow entry">
                        <div class="card-body">
                            <img class="card-img-top" src="${entry.imageUrl}">
                            <p>Name: ${entry.dogName}</p>
                            <p>Entfernung: ${getDistance(entry.lat, entry.lng, this.location.lat, this.location.lng)} km</p>
                            ${this.renderButton(entry.type, entry.id)}
                        </div>
                    </div>
                </div>
            `)}
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
            content = html`<button @click=${() => this.showDetails(id)} class="btn btn-primary">Führ mich aus <i class="fas fa-paw"></i></a>`
        }
        else {
            content = html`<button @click=${() => this.showDetails(id)} class="btn btn-primary">Pass auf mich auf <i class="fas fa-bone"></i></a>`
        }
        return content;
    }

    //helper function to toggle the visibility status of elements
    toggleView(id: string) {
        var element = this.shadowRoot?.querySelector(id);
        element?.classList.toggle('visually-hidden');

    }

    //toggles between card and map view
    toggleButton = () => {
        var button = this.shadowRoot?.querySelector('#toggle-btn') as HTMLElement;
        if (button!.innerText == "Zur Kartenansicht") {
            button!.innerText = "Zur Kachelansicht";
        }
        else {
            button!.innerText = "Zur Kartenansicht";            
        }
        document.querySelector('app-root')?.shadowRoot?.querySelector('app-footer')?.toggleAttribute('hidden');
        this.toggleView('#entries');
        this.toggleView('#map-container');

    }

    //creates a Google Map on the #map div
    createMap() {        

        //Create Google Map
        if (!window.google) {
            const loader = new Loader({
                apiKey: "AIzaSyApvgXYHn99FigrI9QuMMfrIbxHqiEY1yA",
                version: "weekly"
            });
            loader.load().then(() => {
                this.map = new google.maps.Map(this.shadowRoot?.querySelector('#map') as HTMLElement, {
                  center: this.location,
                  zoom: 13,
                  disableDefaultUI: true
                });
              }).then(() => {
                for (let i=0; i < this.entries.length; i++) {
                    this.addMarker(this.entries[i]);
                  }
              });
        }
        else {
                this.map = new google.maps.Map(this.shadowRoot?.querySelector('#map') as HTMLElement, {
                  center: this.location,
                  zoom: 13,
                  disableDefaultUI: true
                });
                for (let i=0; i < this.entries.length; i++) {
                    this.addMarker(this.entries[i]);
                  }
        }
        
    }

    //called after render has been called for the first time. Opens the modal dialog
    async firstUpdated() {       

        //check if the user location is saved in a cookie
        let cookies = Cookies.get();
        if(cookies.lat) {
            this.location.lat = parseFloat(cookies.lat);
            this.location.lng = parseFloat(cookies.lng);
            console.log(Cookies.get());
        }
        //call modal for User Location
        else {
            let modal = this.shadowRoot?.querySelector('#locationModal') as HTMLElement;
            this.modal = new Modal(modal, {backdrop: 'static', keyboard: false});
            this.modal.show();
        }               

        //request entries from api-server
        try {
            const response = await httpClient.get('/entries');
            this.entries = (await response.json()).results;
        }
        catch ({message, statusCode}) {
            switch (statusCode) {
                case 401:
                    router.navigate('/user/sign-in');
                case 404:
                    this.setNotification({ infoMessage: 'Aktuell sind keine offenene Aufträge vorhanden'});
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
        document.getElementById('modal-button')?.classList.toggle('visually-hidden');
        navigator.geolocation.getCurrentPosition(
            pos => {
                this.location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                this.modal?.hide();
                Cookies.set('lat',this.location.lat.toString(), {expires: 7});
                Cookies.set('lng',this.location.lng.toString(), {expires: 7});
            },
            error => {
                alert('Standort wurde nicht freigegeben');
                document.getElementById('modal-spinner')?.classList.toggle('visually-hidden');
                document.getElementById('modal-button')?.classList.toggle('visually-hidden');
            });
    }

    //adds markers on the map for the entries
    addMarker(entry: Entry) {
        // create the markers
        var _this = this;
        var map = this.map;
        var lat = parseFloat(entry.lat);
        var lng = parseFloat(entry.lng);
        var markerPosition = {lat, lng};
        var marker = new google.maps.Marker({
            position: markerPosition,
            map: map
        });
        //create the info windows
        var infoWindow = new google.maps.InfoWindow({
            content: `
            <div style="float:left">
                <img src="${entry.imageUrl}" width="200px" height="150px">
            </div>
            <div style="float:right; padding: 10px;">
                <h5>${entry.dogName}</h5>
                <p>Entfernung: ${getDistance(entry.lat, entry.lng, this.location.lat, this.location.lng)} km</p>
                <p>Datum: ${entry.date}</p>
                <p>Bezahlung: ${entry.pay}€</p>
            </div>`
        });
        //link markers and info windows
        marker.addListener('click', function() {
            _this.closeOpenedWindow();
            infoWindow.open(map,marker);
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
            content = html`<p>Auftragsart: Gassi</p>`
        }
        else {
            content = html`<p>Auftragsart: Aufpassen</p>`
        }
        return content;
    }
}