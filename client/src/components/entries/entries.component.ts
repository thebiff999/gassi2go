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

const entriesComponentCSS = require('./entries.component.scss');

interface Coords {
    lat: number;
    lng: number;
}

@customElement('app-entries')
class EntriesComponent extends PageMixin(LitElement) {

    modal: Modal | undefined;
    map: google.maps.Map | undefined;
    location: Coords;
    openWindow: google.maps.InfoWindow | undefined;

    static styles = [
        css`${unsafeCSS(entriesComponentCSS)}`
    ]

    @internalProperty()
    private entries: Entry[] = [];

    constructor(){
        super();
        this.location = {lat:0, lng:0};
        /*this.entries = [
            {id: '1', name: "Golden-Retriever", coords: {lat: 51.95276, lng: 7.62571}, distance: 20, image: "https://i.imgur.com/XgbZdeA.jpg"},
            {id: '2', name: "Dackel", coords: {lat: 51.96258, lng: 7.62591}, distance: 26, image: "https://i.imgur.com/N7K4w0J.jpg"},
            {id: '3', name: "Rottweiler", coords: {lat: 51.96346, lng: 7.62481}, distance: 31, image: "https://i.imgur.com/26zaH5Y.jpg"},
            {id: '4', name: "Golden-Retriever", coords: {lat: 52.23868633054282, lng: 7.3709097237207715}, distance:1, image: "https://i.imgur.com/XgbZdeA.jpg"},
            {id: '5', name: "Golden-Retriever", coords: {lat: 52.23868633054282, lng: 7.3709097237207715}, distance:1, image: "https://i.imgur.com/XgbZdeA.jpg"}
        ];*/
    }

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
                            <img class="card-img-top" src="${entry.imageUrl}" height="300px" width="400px">
                            <p>Rasse: ${entry.dogName}</p>
                            <p>Entfernung: ${this.getDistance({lat:entry.lat, lng:entry.lng}, this.location)} km</p>
                            <button @click=${() => this.showDetails(entry.id)} class="btn btn-primary">Führ mich aus <i class="fas fa-paw"></i></a>
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

        var entries = this.entries;         

        //Create Google Maps
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
            for (let i=0; i < entries.length; i++) {
                this.addMarker(entries[i]);
              }
          });
    }

    //called after render has been called for the first time. Opens the modal dialog
    async firstUpdated() {       

        //call modal for User Location
        //let modal = this.shadowRoot?.querySelector('#locationModal') as HTMLElement;
        //this.modal = new Modal(modal, {backdrop: 'static', keyboard: false});
        //this.modal.show();

        //request entries from api-server
        try {
            const response = await httpClient.get('/entries');
            this.entries = (await response.json()).results;
        }
        catch ({message, statusCode}) {
            console.log(message);
            console.log(statusCode);
        }
        
    }
    //asks the user for location permission
    askforLocation() {
        document.getElementById('modal-spinner')?.classList.toggle('visually-hidden');
        document.getElementById('modal-button')?.classList.toggle('visually-hidden');
        navigator.geolocation.getCurrentPosition(
            pos => {
                this.location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                this.modal?.hide();
                this.createMap();
                this.requestUpdate();
            },
            error => {
                alert('Standort wurde nicht freigegeben');
                document.getElementById('modal-spinner')?.classList.toggle('visually-hidden');
                document.getElementById('modal-button')?.classList.toggle('visually-hidden');
            });
    }

    addMarker(entry: Entry) {
        // create the markers
        var _this = this;
        var map = this.map;
        var marker = new google.maps.Marker({
            position: {lat:entry.lat, lng:entry.lng},
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
                <p>Entfernung: ${this.getDistance({lat:entry.lat, lng:entry.lng}, this.location!)} km</p>
            </div>`
        });
        //link markers and info windows
        marker.addListener('click', function() {
            _this.closeOpenedWindow();
            infoWindow.open(map,marker);
            _this.saveOpenedWindow(infoWindow);
        });
    }

    saveOpenedWindow(window: google.maps.InfoWindow) {
            this.openWindow = window;
    }

    closeOpenedWindow() {
        this.openWindow?.close();
    }

    getDistance(pos1: Coords, pos2: Coords) {
        var rad = function(x: number) {
            return x * Math.PI / 180;
        }

        var R = 6378137;
        var dLat = rad(pos2.lat - pos1.lat);
        var dLong = rad(pos2.lng - pos1.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(pos1.lat)) * Math.cos(rad(pos2.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = (R * c) / 1000;
        return d.toFixed(1); // returns the distance in kilometer
    }

    getEntries() {
        return this.entries;
    }

    showDetails(entryId: string) {
        router.navigate(`/entries/${entryId}`);
    }
}