import { customElement, html, LitElement, css, unsafeCSS } from "lit-element";
import { repeat } from 'lit-html/directives/repeat';
import { PageMixin } from "../page.mixin";
import { Loader } from "@googlemaps/js-api-loader";
import {} from 'google.maps';
import { Modal } from 'bootstrap';

const entryComponentCSS = require('./entries.component.scss');

interface Coords {
    lat: number;
    lng: number;
}

interface Entry {
    id: number;
    name: string;
    coords: Coords;
    distance: number;
    image: string;
}

@customElement('app-entries')
class EntriesComponent extends PageMixin(LitElement) {

    modal: Modal | undefined;
    map: google.maps.Map | undefined;
    location: Coords;
    entries: Entry[];

    static styles = [
        css`${unsafeCSS(entryComponentCSS)}`
    ]

    constructor(){
        super();
        this.location = {lat:0, lng:0};
        this.entries = [
            {id: 1, name: "Golden-Retriever", coords: {lat: 51.95276, lng: 7.62571}, distance: 20, image: "https://i.imgur.com/XgbZdeA.jpg"},
            {id: 2, name: "Dackel", coords: {lat: 51.96258, lng: 7.62591}, distance: 26, image: "https://i.imgur.com/N7K4w0J.jpg"},
            {id: 3, name: "Rottweiler", coords: {lat: 51.96346, lng: 7.62481}, distance: 31, image: "https://i.imgur.com/26zaH5Y.jpg"},
            {id: 4, name: "Golden-Retriever", coords: {lat: 52.23868633054282, lng: 7.3709097237207715}, distance:1, image: "https://i.imgur.com/XgbZdeA.jpg"}
        ];
    }

    render() {
        var entries = this.getEntries();

        return html`
        
        <div id="locationModal" class="modal blurred" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Standort Freigabe</h5>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Damit Gassi2Go dir Fellnasen in der Nähe anzeigen kann, benötigen wir deinen .</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="${this.askforLocation}">Standort freigeben</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div>
            <button id="toggle-btn" class="btn btn-success toggle-btn" @click=${this.toggleView}>
                Zur Kartenansicht
            </button>
        </div>

        <div id="entries" class="container-fluid">
            <div class="row row-cols-3 row-cols-xxl-4 g-3 g-xxl-5">
                ${repeat(entries, entry => entry.id, entry =>
                html`
                <div class="col">
                    <div class="card shadow entry">
                        <div class="card-body">
                            <img class="card-img-top" src="${entry.image}" height="300px" width="400px">
                            <p>Rasse: ${entry.name}</p>
                            <p>Entfernung: ${this.getDistance(entry.coords, this.location!)} km</p>
                            <a href="#" class="btn btn-primary">Führ mich aus <i class="fas fa-paw"></i></a>
                        </div>
                    </div>
                </div>
            `)}
            </div>
        </div>
        <div id="map-container" class="inactive">
            <div id="map">
            </div>
        </div>
        `;

    }

    //toggles between card and map view
    toggleView = () => {
        var button = this.shadowRoot?.querySelector('#toggle-btn') as HTMLElement;
        if (button!.innerText == "Zur Kartenansicht") {
            button!.innerText = "Zur Kachelansicht";
        }
        else {
            button!.innerText = "Zur Kartenansicht";
        }
        var entries = this.shadowRoot?.querySelector('#entries');
        var map = this.shadowRoot?.querySelector('#map-container');
        entries?.classList.toggle('inactive');
        map?.classList.toggle('inactive');
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
        let modal = this.shadowRoot?.querySelector('#locationModal') as HTMLElement;
        this.modal = new Modal(modal, {backdrop: 'static', keyboard: false});
        this.modal.show();
        
    }
    //asks the user for location permission
    askforLocation() {
        navigator.geolocation.getCurrentPosition(
            pos => {
                this.location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                this.modal?.hide();
                this.createMap();
                this.requestUpdate();
            },
            error => alert('Standort wurde nicht freigegeben')
            );
    }

    addMarker(entry: Entry) {
        // create the markers
        var map = this.map;
        var marker = new google.maps.Marker({
            position: entry.coords,
            map: map
        });
        //create the info windows
        var infoWindow = new google.maps.InfoWindow({
            content: `
            <div style="float:left">
                <img src="${entry.image}" width="200px" height="150px">
            </div>
            <div style="float:right; padding: 10px;">
                <h5>${entry.name}</h5>
                <p>Entfernung: ${this.getDistance(entry.coords, this.location!)} km</p>
            </div>`
        });
        //link markers and info windows
        marker.addListener('click', function() {
            infoWindow.open(map,marker);
        });
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
}